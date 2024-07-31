export enum ErrorCode {
  NotFound = 40401,
  MemberNotFound = 40402,
  BookNotFound = 40403,
  BorrowedBookNotfound = 40404,

  BadRequestBody = 4001,
  BorrowBookLimit = 4002,
  MemberPenelized = 4003,
  BookBorrowed = 4004,
  AlreadyBorrowed = 4005,

  InternalServerError = 5001,
  InternalServerDatabaseError = 5002,
  InternalServerErrorAuthConfig = 5003,
}
