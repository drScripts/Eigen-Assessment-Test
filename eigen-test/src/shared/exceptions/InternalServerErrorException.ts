import {
  HttpStatus,
  InternalServerErrorException as NestInternalServerErrorException,
} from '@nestjs/common';
import { ErrorCode } from './ErrorCode';
import dayjs from 'dayjs';

export class InternalServerErrorException extends NestInternalServerErrorException {
  constructor(private errorCode: ErrorCode = ErrorCode.InternalServerError) {
    super({
      message: 'Internal Server Error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorCode,
      timetimestamp: dayjs().toISOString(),
    });
  }

  getErrorCode(): number {
    return this.errorCode;
  }
}
