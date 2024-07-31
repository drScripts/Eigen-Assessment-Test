import {
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { MemberRepository } from '../members.repository';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { MemberBooksBorrowed } from '../../../modules/member-books-borrowed/entities/member-books-borrowed.entity';

@Entity({ repository: () => MemberRepository, tableName: 'members' })
export class Member {
  @PrimaryKey({
    onCreate: () => uuidv4(),
  })
  @ApiProperty()
  id!: string;

  @Property()
  @ApiProperty()
  name!: string;

  @Property({ onCreate: () => new Date(), fieldName: 'created_at' })
  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  @Property({ nullable: true })
  borrowedBooksCount: number;

  @OneToMany(() => MemberBooksBorrowed, (borrowedBook) => borrowedBook.member)
  borrowedBooks = new Collection<MemberBooksBorrowed>(this);

  @ApiProperty({
    nullable: true,
  })
  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    fieldName: 'updated_at',
  })
  updatedAt!: Date;

  @ApiProperty({
    nullable: true,
  })
  @Property({ nullable: true, fieldName: 'penalized_at' })
  penalizedAt?: Date;

  [EntityRepositoryType]?: MemberRepository;

  constructor(name: string) {
    this.name = name;
  }
}
