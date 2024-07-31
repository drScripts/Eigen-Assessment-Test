import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto, createBookSchema } from './dto/create-book.dto';
import { UpdateBookDto, updateBookSchema } from './dto/update-book.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '../../shared/decorators/response';
import { Book } from './entities/book.entity';
import { DataResponse } from '../../shared/types/DataResponse';
import { ZodValidationPipe } from '../../shared/pipes/zodValidationPipe';

@Controller('books')
@ApiTags('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiResponse(Book, true)
  @HttpCode(HttpStatus.OK)
  async find(): Promise<DataResponse<Array<Book>>> {
    const books = await this.booksService.find();

    const newBooks = books.map((book) => {
      // Count the borrowed books where returnedAt is null
      const borrowedBooksCount = book.borrowedBooks
        .getItems()
        .filter((borrow) => !borrow.returnedAt).length;

      const newBook: Book = {
        ...book,
        borrowedBooks: undefined,
        available: book.stock - borrowedBooksCount,
      };
      return newBook;
    });

    return new DataResponse(newBooks);
  }

  @Post()
  @ApiResponse(Book)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createBookSchema))
  async create(
    @Body() createBookDto: CreateBookDto,
  ): Promise<DataResponse<Book>> {
    const book = await this.booksService.create(createBookDto);
    return new DataResponse(book);
  }

  @Get(':id')
  @ApiResponse(Book)
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<DataResponse<Book>> {
    const book = await this.booksService.getById(id);

    const borrowedBooksCount = book.borrowedBooks
      .getItems()
      .filter((borrow) => !borrow.returnedAt).length;

    const newBook: Book = {
      ...book,
      available: book.stock - borrowedBooksCount,
    };

    return new DataResponse(newBook);
  }

  @Patch(':id')
  @ApiResponse(Book)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateBookSchema))
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<DataResponse<Book>> {
    const book = await this.booksService.update(id, updateBookDto);
    return new DataResponse(book);
  }

  @Delete(':id')
  @ApiResponse(Book)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<DataResponse<Book>> {
    const book = await this.booksService.delete(id);
    return new DataResponse(book);
  }
}
