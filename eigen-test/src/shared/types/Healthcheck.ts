import { ApiProperty } from '@nestjs/swagger';

export class Healthcheck {
  @ApiProperty({
    enum: ['available', 'unavailable'],
  })
  status: 'available' | 'unavailable';

  @ApiProperty()
  maintenance: boolean;
}
