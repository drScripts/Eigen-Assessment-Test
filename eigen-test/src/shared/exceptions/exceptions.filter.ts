import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ErrorCode } from './ErrorCode';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    if (exception instanceof HttpException) {
      const responseObject = exception.getResponse();

      if (responseObject instanceof Object) {
        const errorResponse = {
          ...responseObject,
          path: request.url,
        };

        response.status(exception.getStatus()).send(errorResponse);
        return;
      }
    }

    const errorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorCode: ErrorCode.InternalServerError,
      message: this.getErrorMessage(exception),
      timestamp: dayjs().toISOString(),
      path: request.url,
    };

    response.code(HttpStatus.INTERNAL_SERVER_ERROR).send(errorResponse);
  }

  private getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return typeof response === 'string'
        ? response
        : (response as any).message;
    }
    return 'Internal server error';
  }
}
