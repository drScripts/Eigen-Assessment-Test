import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const createMemberSchema = z.object({
  name: z.string(),
});

export class CreateMemberDto extends createZodDto(createMemberSchema) {}
