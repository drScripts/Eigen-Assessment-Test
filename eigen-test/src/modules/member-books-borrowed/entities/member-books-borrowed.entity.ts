import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Book } from '../../../modules/books/entities/book.entity';
import { Member } from '../../../modules/members/entities/member.entity';
import { MemberBooksBorrowedRepository } from '../member-books-borrowed.repository';
import { v4 as uuidv4 } from 'uuid';

@Entity({
  tableName: 'member_books_borrowed',
  repository: () => MemberBooksBorrowedRepository,
})
export class MemberBooksBorrowed {
  @PrimaryKey({
    onCreate: () => uuidv4(),
  })
  @Property()
  id!: string;

  @ManyToOne(() => Member, {
    nullable: true,
    fieldName: 'member_id',
    deleteRule: 'set null',
  })
  member!: Member;

  @ManyToOne(() => Book, {
    nullable: true,
    fieldName: 'book_id',
    deleteRule: 'set null',
  })
  book!: Book;

  @Property({ onCreate: () => new Date(), fieldName: 'borrowed_at' })
  @ApiProperty()
  borrowedAt!: Date;

  @ApiProperty({ nullable: true })
  @Property({ nullable: true, fieldName: 'returned_at' })
  returnedAt?: Date;

  constructor(member: Member, book: Book) {
    this.book = book;
    this.member = member;
  }
}
