import {
  HttpStatus,
  BadRequestException as NestBadRequestException,
} from '@nestjs/common';
import { ErrorCode } from './ErrorCode';
import dayjs from 'dayjs';
import ErrorMessage from './ErrorMessage';

export class BadRequestException extends NestBadRequestException {
  constructor(
    message?: string,
    private errorCode: ErrorCode = ErrorCode.BadRequestBody,
  ) {
    let returnMessage = ErrorMessage[errorCode] || 'Bad Request';
    if (message) {
      returnMessage = message;
    }

    super({
      message: returnMessage,
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode,
      timetimestamp: dayjs().toISOString(),
    });
  }

  getErrorCode(): number {
    return this.errorCode;
  }
}
