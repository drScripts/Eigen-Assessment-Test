import { forwardRef, Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './entities/book.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MemberBooksBorrowedModule } from '../member-books-borrowed/member-books-borrowed.module';

@Module({
  imports: [
    forwardRef(() => MemberBooksBorrowedModule),
    MikroOrmModule.forFeature([Book]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
