import {
  HttpStatus,
  NotFoundException as NestNotFoundException,
} from '@nestjs/common';
import { ErrorCode } from './ErrorCode';
import dayjs from 'dayjs';
import ErrorMessage from './ErrorMessage';

export class NotFoundException extends NestNotFoundException {
  constructor(private errorCode: ErrorCode = ErrorCode.BadRequestBody) {
    const message = ErrorMessage[errorCode] || 'Not Found';

    super({
      message,
      statusCode: HttpStatus.NOT_FOUND,
      errorCode,
      timetimestamp: dayjs().toISOString(),
    });
  }

  getErrorCode(): number {
    return this.errorCode;
  }
}
