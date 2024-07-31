import { Test, TestingModule } from '@nestjs/testing';
import { MemberBooksBorrowedService } from './member-books-borrowed.service';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../../mikro-orm.test.config';
import { MemberRepository } from '../members/members.repository';
import { Member } from '../members/entities/member.entity';
import { BookRepository } from '../books/books.repository';
import { Book } from '../books/entities/book.entity';
import { MemberBooksBorrowedRepository } from './member-books-borrowed.repository';
import ErrorMessage from '../../shared/exceptions/ErrorMessage';
import { ErrorCode } from '../../shared/exceptions/ErrorCode';
import { MembersService } from '../members/members.service';
import { BooksService } from '../books/books.service';
import { MemberBooksBorrowed } from './entities/member-books-borrowed.entity';
import dayjs from 'dayjs';

describe('BorrowService', () => {
  let service: MemberBooksBorrowedService;
  let bookService: BooksService;
  let memberService: MembersService;

  let repository: MemberBooksBorrowedRepository;
  let orm: MikroORM;
  let em: EntityManager;

  beforeAll(async () => {
    orm = await MikroORM.init(mikroOrmConfig());
    em = orm.em.fork();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberBooksBorrowedService,
        MembersService,
        BooksService,
        {
          provide: MemberRepository,
          useFactory: () => em.getRepository(Member),
        },
        {
          provide: BookRepository,
          useFactory: () => em.getRepository(Book),
        },
        {
          provide: MemberBooksBorrowedRepository,
          useFactory: () => em.getRepository(MemberBooksBorrowed),
        },
        {
          provide: EntityManager,
          useValue: em,
        },
      ],
    }).compile();

    service = module.get<MemberBooksBorrowedService>(
      MemberBooksBorrowedService,
    );
    bookService = module.get<BooksService>(BooksService);
    memberService = module.get<MembersService>(MembersService);

    repository = module.get<MemberBooksBorrowedRepository>(
      MemberBooksBorrowedRepository,
    );
  });

  afterAll(async () => {
    await orm.close(true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should allow a member to borrow a book if all conditions are met', async () => {
    const { '0': member, '1': book } = await Promise.all([
      memberService.create({ name: 'John Doe' }),
      bookService.create({
        author: 'Book Title',
        title: 'Author Name',
        stock: 1,
      }),
    ]);

    await service.borrowBook(member.id, [book.id]);

    const borrowedBooks = await repository.find({
      member: {
        id: member.id,
      },
    });

    expect(borrowedBooks.length).toBe(1);
    expect(borrowedBooks[0].book.id).toBe(book.id);
  });

  it('should not allow a member to borrow more than 2 books', async () => {
    const {
      '0': member,
      '1': book1,
      '2': book2,
      '3': book3,
    } = await Promise.all([
      memberService.create({ name: 'Jane Doe' }),
      bookService.create({
        title: 'Book Title 1',
        author: 'Author Name 1',
        stock: 1,
      }),
      bookService.create({
        title: 'Book Title 2',
        author: 'Author Name 2',
        stock: 1,
      }),
      bookService.create({
        title: 'Book Title 3',
        author: 'Author Name 3',
        stock: 1,
      }),
    ]);

    await service.borrowBook(member.id, [book2.id, book3.id]);

    await expect(service.borrowBook(member.id, [book1.id])).rejects.toThrow(
      ErrorMessage[ErrorCode.BorrowBookLimit],
    );
  });

  it('should not allow borrowing a book that is already borrowed by another member', async () => {
    const { '0': member1, '1': book } = await Promise.all([
      memberService.create({ name: 'Alice' }),
      bookService.create({
        title: 'Book Title',
        author: 'Author Name',
        stock: 1,
      }),
    ]);

    await service.borrowBook(member1.id, [book.id]);
  });

  it('should not allow a penalized member to borrow a book', async () => {
    const member = await memberService.create({ name: 'Eve' });
    await memberService.update(member.id, { penalizedAt: new Date() });

    const book = await bookService.create({
      title: 'Book Title',
      author: 'Author Name',
      stock: 1,
    });

    await expect(service.borrowBook(member.id, [book.id])).rejects.toThrow(
      ErrorMessage[ErrorCode.MemberPenelized],
    );
  });

  // Add the new test cases for returnBook method
  describe('returnBook', () => {
    it('should successfully return a borrowed book', async () => {
      const { '0': member, '1': book } = await Promise.all([
        memberService.create({ name: 'John Doe' }),
        bookService.create({
          author: 'Book Title',
          title: 'Author Name',
          stock: 1,
        }),
      ]);

      await service.borrowBook(member.id, [book.id]);

      const bookCodes = [book.id];

      const updatedBorrowedBooks = await service.returnBook(
        member.id,
        bookCodes,
      );

      expect(updatedBorrowedBooks[0].returnedAt).toBeInstanceOf(Date);
    });

    it('should apply a penalty if the book is returned after more than 7 days', async () => {
      const { '0': member, '1': book } = await Promise.all([
        memberService.create({ name: 'Jane Doe' }),
        bookService.create({
          title: 'Book Title',
          author: 'Author Name',
          stock: 1,
        }),
      ]);

      await service.borrowBook(member.id, [book.id]);

      const borrowedBooks = await repository.find({
        member: {
          id: member.id,
        },
      });

      // Simulate a late return by adjusting the borrowedAt date
      const borrowedBook = borrowedBooks[0];

      borrowedBook.borrowedAt = dayjs().subtract(10, 'days').toDate();

      await em.persistAndFlush(borrowedBook);

      const bookCodes = [book.id];

      await service.returnBook(member.id, bookCodes);

      const updatedMember = await memberService.getById(member.id);

      expect(updatedMember.penalizedAt).toBeInstanceOf(Date);
      expect(updatedMember.penalizedAt.getTime()).toBeGreaterThan(
        dayjs().subtract(10, 'days').toDate().getTime(),
      );
    });

    it('should not return a book that was not borrowed by the member', async () => {
      const { '0': member, '1': book } = await Promise.all([
        memberService.create({ name: 'Charlie' }),
        bookService.create({
          title: 'Book Title',
          author: 'Author Name',
          stock: 1,
        }),
      ]);

      const bookCodes = [book.id];

      await expect(service.returnBook(member.id, bookCodes)).rejects.toThrow(
        ErrorMessage[ErrorCode.BorrowedBookNotfound],
      );
    });

    it('should not allow a member to return a book that was not borrowed by them', async () => {
      const {
        '0': member1,
        '1': member2,
        '2': book,
      } = await Promise.all([
        memberService.create({ name: 'Alice' }),
        memberService.create({ name: 'Bob' }),
        bookService.create({
          title: 'Book Title',
          author: 'Author Name',
          stock: 1,
        }),
      ]);

      await service.borrowBook(member1.id, [book.id]);

      const bookCodes = [book.id];

      await expect(service.returnBook(member2.id, bookCodes)).rejects.toThrow(
        ErrorMessage[ErrorCode.BorrowedBookNotfound],
      );
    });
  });
});
