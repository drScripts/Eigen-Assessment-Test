import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { BadRequestException } from '../exceptions/BadRequestException';
import { ErrorCode } from '../exceptions/ErrorCode';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, { type }: ArgumentMetadata) {
    if (type === 'body') {
      try {
        const parsedValue = this.schema.parse(value);
        return parsedValue;
      } catch (error: any) {
        if (error instanceof ZodError) {
          for (const fieldError of error.errors) {
            if (fieldError.message) {
              throw new BadRequestException(
                fieldError.message,
                ErrorCode.BadRequestBody,
              );
            }
          }
        }

        throw new BadRequestException(null, ErrorCode.BadRequestBody);
      }
    } else {
      return value;
    }
  }
}
