import {
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BookRepository } from '../books.repository';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { MemberBooksBorrowed } from '../../../modules/member-books-borrowed/entities/member-books-borrowed.entity';

@Entity({ repository: () => BookRepository, tableName: 'books' })
export class Book {
  @PrimaryKey({
    primary: true,
  })
  @ApiProperty()
  id!: string;

  @ApiProperty()
  @Property()
  title!: string;

  @ApiProperty()
  @Property()
  author!: string;

  @ApiProperty()
  @Property()
  stock!: number;

  @ApiProperty()
  @Property({ nullable: true })
  available: number

  @OneToMany(() => MemberBooksBorrowed, borrowedBook => borrowedBook.book)
  borrowedBooks = new Collection<MemberBooksBorrowed>(this);

  @Property({ onCreate: () => new Date(), fieldName: 'created_at' })
  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({
    nullable: true,
  })
  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    fieldName: 'updated_at',
  })
  updatedAt!: Date;

  [EntityRepositoryType]?: BookRepository;

  constructor(title: string, author: string, stock: number) {
    this.id = uuidv4()
    this.title = title;
    this.author = author;
    this.stock = stock;
    this.available = stock
  }
}
