import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { BookRepository } from './books.repository';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../../mikro-orm.test.config';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import ErrorMessage from '../../shared/exceptions/ErrorMessage';
import { ErrorCode } from '../../shared/exceptions/ErrorCode';

describe('BooksService', () => {
  let service: BooksService;
  let orm: MikroORM;
  let em: EntityManager;

  beforeAll(async () => {
    orm = await MikroORM.init(mikroOrmConfig());
    em = orm.em.fork();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: BookRepository,
          useFactory: () => em.getRepository(Book),
        },
        {
          provide: EntityManager,
          useValue: em,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined create function', async () => {
    expect(service.create).toBeDefined();
  });

  it('should be create book', async () => {
    const createBook: CreateBookDto = {
      author: 'J.K Rowling',
      title: 'Harry Potter',
      stock: 1,
    };

    const book = await service.create(createBook);

    expect(book.id).toBeDefined();
    expect(book.title).toEqual(createBook.title);
    expect(book.author).toEqual(createBook.author);
  });

  it('should be update book', async () => {
    const createBook: CreateBookDto = {
      author: 'JK Rowling',
      title: 'Hally Potter',
      stock: 1,
    };

    const book = await service.create(createBook);

    const updateBook: UpdateBookDto = {
      author: 'J.K Rowling',
      title: 'Harry Potter',
    };

    const updatedBook = await service.update(book.id, updateBook);

    expect(updatedBook.id).toBeDefined();
    expect(updatedBook.id).toEqual(book.id);
    expect(updatedBook.title).toEqual(updateBook.title);
    expect(updateBook.author).toEqual(updateBook.author);
  });

  it('should be get by id', async () => {
    const createBook: CreateBookDto = {
      author: 'J.K Rowling',
      title: 'Harry Potter',
      stock: 1,
    };

    const createdBook = await service.create(createBook);

    expect(createdBook).toBeDefined();
    expect(createdBook.id).toBeDefined();

    const book = await service.getById(createdBook.id);
    expect(book).toStrictEqual(createdBook);

    await expect(service.getById('MYID')).rejects.toThrow(
      ErrorMessage[ErrorCode.BookNotFound],
    );
  });

  it('should be find', async () => {
    const createBook1: CreateBookDto = {
      author: 'J.K Rowling1',
      title: 'Harry Potter',
      stock: 1,
    };
    await service.create(createBook1);

    const createBook2: CreateBookDto = {
      author: 'J.K Rowling2',
      title: 'Harry Potter',
      stock: 1,
    };
    await service.create(createBook2);

    const books = await service.find();
    expect(books).toBeDefined();
    expect(books.length).not.toEqual(0);
  });

  it('should be delete a book', async () => {
    const createBook: CreateBookDto = {
      author: 'J.K Rowling',
      title: 'Harry Potter',
      stock: 1,
    };
    const createdBook = await service.create(createBook);
    expect(createdBook.id).toBeDefined();

    const book = await service.delete(createdBook.id);
    expect(book).toStrictEqual(createdBook);

    await expect(service.getById(createdBook.id)).rejects.toThrow(
      ErrorMessage[ErrorCode.BookNotFound],
    );
  });
});
