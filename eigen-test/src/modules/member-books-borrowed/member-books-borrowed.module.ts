import { forwardRef, Module } from '@nestjs/common';
import { MemberBooksBorrowedService } from './member-books-borrowed.service';
import { BooksModule } from '../books/books.module';
import { MembersModule } from '../members/members.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MemberBooksBorrowed } from './entities/member-books-borrowed.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([MemberBooksBorrowed]),
    forwardRef(() => BooksModule),
    forwardRef(() => MembersModule),
  ],
  controllers: [],
  providers: [MemberBooksBorrowedService],
  exports: [MemberBooksBorrowedService],
})
export class MemberBooksBorrowedModule {}
