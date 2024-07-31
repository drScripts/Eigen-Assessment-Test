import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse as SwaggerApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { DataResponse } from '../types/DataResponse';

export const ApiResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  isArray: boolean = false,
) => {
  const dataSchema = isArray
    ? {
        type: 'array',
        items: { $ref: getSchemaPath(dataDto) },
      }
    : { $ref: getSchemaPath(dataDto) };

  return applyDecorators(
    ApiExtraModels(DataResponse, dataDto),
    SwaggerApiResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(DataResponse) },
          {
            properties: {
              data: dataSchema,
            },
          },
        ],
      },
    }),
  );
};
