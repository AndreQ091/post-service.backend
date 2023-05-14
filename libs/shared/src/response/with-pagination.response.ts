import { Type, applyDecorators } from '@nestjs/common';
import { PaginationDto } from '../dto';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export class ResponseWithPagination<T> extends PaginationDto {
  total: number;
  data: T[];
}

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(Response, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(Response) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
