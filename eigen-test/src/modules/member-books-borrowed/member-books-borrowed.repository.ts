import { EntityRepository } from '@mikro-orm/core';
import { MemberBooksBorrowed } from './entities/member-books-borrowed.entity';

export class MemberBooksBorrowedRepository extends EntityRepository<MemberBooksBorrowed> {
  public async findBorrowedBook(
    bookIds: Array<string>,
  ): Promise<MemberBooksBorrowed[]> {
    return this.find(
      {
        book: {
          id: {
            $in: bookIds,
          },
        },
        returnedAt: {
          $eq: null,
        },
      },
      { populate: ['*'] },
    );
  }

  public async findMemberBorrowedBook(
    memberId: string,
  ): Promise<MemberBooksBorrowed[]> {
    return this.find(
      {
        member: {
          id: memberId,
        },
        returnedAt: {
          $eq: null,
        },
      },
      { populate: ['*'] },
    );
  }

  public async findMemberBorrowedByBookCodes(
    memberId: string,
    bookIds: Array<string>,
  ): Promise<MemberBooksBorrowed[]> {
    return this.find(
      {
        member: {
          id: memberId,
        },
        book: {
          id: {
            $in: bookIds,
          },
        },
        returnedAt: {
          $eq: null,
        },
      },
      { populate: ['*'] },
    );
  }
}
