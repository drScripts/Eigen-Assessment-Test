import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const updateMemberSchema = z.object({
  name: z.string().nullish(),
});

export class UpdateMemberDto extends createZodDto(updateMemberSchema) {
  penalizedAt?: Date;
}
