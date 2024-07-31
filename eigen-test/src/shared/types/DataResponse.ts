import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';

export class DataResponse<T> {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: T;

  @ApiProperty()
  timestamp: string;

  constructor(data: T, message: string = 'success', statusCode: number = 200) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = dayjs().toISOString();
  }
}
