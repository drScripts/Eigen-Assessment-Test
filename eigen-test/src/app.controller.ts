import { Controller, Get, HttpCode } from '@nestjs/common';
import { Healthcheck } from './shared/types/Healthcheck';
import { ApiResponse } from './shared/decorators/response';
import { DataResponse } from './shared/types/DataResponse';

@Controller()
export class AppController {
  constructor() {}

  @Get('healthcheck')
  @ApiResponse(Healthcheck)
  @HttpCode(200)
  healthcheck(): DataResponse<Healthcheck> {
    return new DataResponse({
      status: 'available',
      maintenance: false,
    });
  }
}
