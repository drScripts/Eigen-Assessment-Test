import { Injectable, Logger } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './entities/book.entity';
import { BookRepository } from './books.repository';
import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { NotFoundException } from '../../shared/exceptions/NotFoundException';
import { InternalServerErrorException } from '../../shared/exceptions/InternalServerErrorException';
import { ErrorCode } from '../../shared/exceptions/ErrorCode';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookFilter } from './dto/book-filter.dto';
import { MemberBooksBorrowed } from '../member-books-borrowed/entities/member-books-borrowed.entity';

@Injectable()
export class BooksService {
  readonly #logger = new Logger(BooksService.name);

  constructor(
    private readonly bookRepository: BookRepository,
    private readonly em: EntityManager,
  ) { }

  async create(input: CreateBookDto): Promise<Book> {
    try {
      const book: Book = new Book(input.title, input.author, input.stock);

      await this.em.persistAndFlush(book);

      return book;
    } catch (error) {
      console.log(error);

      this.#logger.fatal('failed to create', {
        error,
      });

      throw new InternalServerErrorException(
        ErrorCode.InternalServerDatabaseError,
      );
    }
  }

  async getById(id: string): Promise<Book> {
    try {
      const book: Book = await this.bookRepository.findOne({
        id,
      }, { populate: ["borrowedBooks"] });

      if (!book) {
        throw new NotFoundException(ErrorCode.BookNotFound);
      }

      return book;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.#logger.fatal('failed to get by id', {
        error,
      });

      throw new InternalServerErrorException(
        ErrorCode.InternalServerDatabaseError,
      );
    }
  }

  async update(id: string, input: UpdateBookDto): Promise<Book> {
    try {
      const book: Book = await this.bookRepository.findOne({
        id
      })
      if (!book) {
        throw new NotFoundException(ErrorCode.BookNotFound)
      }

      if (input.stock) {
        book.stock = input.stock
      }

      if (input.author) {
        book.author = input.author;
      }

      if (input.title) {
        book.title = input.title;
      }

      await this.em.persistAndFlush(book);

      return book;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.#logger.fatal('failed to update', {
        error,
      });

      throw new InternalServerErrorException(
        ErrorCode.InternalServerDatabaseError,
      );
    }
  }

  async find(filter?: BookFilter): Promise<Array<Book>> {
    try {
      const query: FilterQuery<Book> = {};

      if (filter?.id) {
        query.id = { $eq: filter.id };
      } else if (filter?.ids) {
        query.id = { $in: filter.ids };
      }

      const books = await this.bookRepository.find(query, { populate: ['borrowedBooks'] })

      return books
    } catch (error) {
      this.#logger.fatal('failed to find', {
        error,
      });

      throw new InternalServerErrorException(
        ErrorCode.InternalServerDatabaseError,
      );
    }
  }

  async delete(id: string): Promise<Book> {
    const book = await this.getById(id);

    try {
      await this.em.removeAndFlush(book);

      return book;
    } catch (error) {
      this.#logger.fatal('failed to delete', {
        error,
      });

      throw new InternalServerErrorException(
        ErrorCode.InternalServerDatabaseError,
      );
    }
  }
}
