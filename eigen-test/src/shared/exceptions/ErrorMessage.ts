import { ErrorCode } from './ErrorCode';

export default {
  [ErrorCode.BadRequestBody]: 'invalid request body',
  [ErrorCode.BorrowBookLimit]: 'Members may not borrow more than 2 books',
  [ErrorCode.BookBorrowed]: 'some book is borrowed by another member',
  [ErrorCode.AlreadyBorrowed]: 'some book already borrowed by member',
  [ErrorCode.MemberPenelized]: 'Member is currently penalized',

  [ErrorCode.NotFound]: 'resource not found',
  [ErrorCode.MemberNotFound]: 'member data not found',
  [ErrorCode.BookNotFound]: 'book data not found',
  [ErrorCode.BorrowedBookNotfound]: 'borrowed book history not found',
};
