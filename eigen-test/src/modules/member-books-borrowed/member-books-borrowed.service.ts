import { Injectable, Logger } from '@nestjs/common';
import { MemberBooksBorrowedRepository } from './member-books-borrowed.repository';
import { EntityManager } from '@mikro-orm/core';
import { MemberBooksBorrowed } from './entities/member-books-borrowed.entity';
import { BadRequestException } from '../../shared/exceptions/BadRequestException';
import { ErrorCode } from '../../shared/exceptions/ErrorCode';
import { BooksService } from '../books/books.service';
import { MembersService } from '../members/members.service';
import dayjs from 'dayjs';
import { emptyPromise, isArrayUnique } from '../../shared/libs/libs';
import { NotFoundException } from '../../shared/exceptions/NotFoundException';
import { InternalServerErrorException } from '../../shared/exceptions/InternalServerErrorException';
import { FilterMemberBooksBorrowed } from './dto/filter-member-books-borrowed.dto';

@Injectable()
export class MemberBooksBorrowedService {
  readonly #logger = new Logger(MemberBooksBorrowedService.name);

  constructor(
    private readonly memberBooksBorrowedRepository: MemberBooksBorrowedRepository,
    private readonly bookService: BooksService,
    private readonly memberService: MembersService,
    private readonly em: EntityManager,
  ) { }

  async find(
    filter: FilterMemberBooksBorrowed,
  ): Promise<Array<MemberBooksBorrowed>> {
    try {
      const response = await this.memberBooksBorrowedRepository.find({
        returnedAt: filter.returnedAt,
      });

      return response;
    } catch (error) {
      this.#logger.fatal('failed to borrow book', {
        error,
      });

      throw new InternalServerErrorException(
        ErrorCode.InternalServerDatabaseError,
      );
    }
  }

  async borrowBook(
    memberId: string,
    bookIds: Array<string>,
  ): Promise<Array<MemberBooksBorrowed>> {
    if (!bookIds.length) {
      throw new BadRequestException(
        'book ids should not be empty',
        ErrorCode.BadRequestBody,
      );
    }

    if (!isArrayUnique(bookIds)) {
      throw new BadRequestException(
        'book ids should not be duplicated',
        ErrorCode.BadRequestBody,
      );
    }

    try {
      const {
        '0': memberBorrowedBooks,
        '1': books,
        '2': member,
      } = await Promise.all([
        this.memberBooksBorrowedRepository.findMemberBorrowedBook(memberId),
        this.bookService.find({
          ids: bookIds,
        }),
        this.memberService.getById(memberId),
      ]);

      if (
        memberBorrowedBooks.length >= 2 ||
        books.length > 2 ||
        bookIds.length > 2 ||
        memberBorrowedBooks.length + bookIds.length > 2
      ) {
        throw new BadRequestException(null, ErrorCode.BorrowBookLimit);
      }

      if (books.length !== bookIds.length) {
        throw new BadRequestException(
          'some books not found',
          ErrorCode.BadRequestBody,
        );
      }

      for (const book of books) {
        const bookAlreadyBooked = memberBorrowedBooks.find(b => b.book.id == book.id)
        if (bookAlreadyBooked) {
          throw new BadRequestException(null, ErrorCode.AlreadyBorrowed);
        }

        const borrowedBooksCount = member.borrowedBooks
          .getItems()
          .filter((borrow) => !borrow.returnedAt).length;


        if (!(book.stock - borrowedBooksCount)) {
          throw new BadRequestException(null, ErrorCode.BookBorrowed);
        }
      }

      if (member.penalizedAt) {
        const penalizedAt = dayjs(member.penalizedAt);
        const currentDate = dayjs();
        const diffDay = currentDate.diff(penalizedAt, 'days');

        if (diffDay <= 3) {
          throw new BadRequestException(null, ErrorCode.MemberPenelized);
        }
      }

      const borrowedBookInputs: Array<MemberBooksBorrowed> = [];

      for (const bookId of bookIds) {
        const book = books.find((v) => v.id === bookId);

        borrowedBookInputs.push(new MemberBooksBorrowed(member, book));
      }

      await this.em.persistAndFlush(borrowedBookInputs);

      return borrowedBookInputs;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      this.#logger.fatal('failed to borrow book', {
        error,
      });

      throw new InternalServerErrorException(
        ErrorCode.InternalServerDatabaseError,
      );
    }
  }

  async returnBook(
    memberId: string,
    bookIds: Array<string>,
  ): Promise<Array<MemberBooksBorrowed>> {
    if (!bookIds.length) {
      throw new BadRequestException(
        'book ids should not be empty',
        ErrorCode.BadRequestBody,
      );
    }

    try {
      const { '0': borrowedBooks, '1': member } = await Promise.all([
        this.memberBooksBorrowedRepository.findMemberBorrowedByBookCodes(
          memberId,
          bookIds,
        ),
        this.memberService.getById(memberId),
      ]);

      if (borrowedBooks.length !== bookIds.length) {
        throw new BadRequestException(null, ErrorCode.BorrowedBookNotfound);
      }

      let shouldPenalize = false;

      const memberBorrowedBooks: Array<MemberBooksBorrowed> = [];

      for (const bookId of bookIds) {
        const currentDate = dayjs();
        const borrowedBook = borrowedBooks.find((b) => b.book.id === bookId);

        borrowedBook.returnedAt = dayjs().toDate();

        if (currentDate.diff(borrowedBook.borrowedAt, 'weeks') >= 1) {
          shouldPenalize = true;
        }

        memberBorrowedBooks.push(borrowedBook);
      }

      await Promise.all([
        this.em.persistAndFlush(memberBorrowedBooks),
        shouldPenalize
          ? this.memberService.update(member.id, {
            penalizedAt: dayjs().toDate(),
          })
          : emptyPromise(),
      ]);

      return memberBorrowedBooks;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      this.#logger.fatal('failed to return book', {
        error,
      });

      throw new InternalServerErrorException(
        ErrorCode.InternalServerDatabaseError,
      );
    }
  }
}
