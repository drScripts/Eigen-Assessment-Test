import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const returnBookSchema = z.object({
  bookIds: z.array(z.string()),
});

export class ReturnBookDto extends createZodDto(returnBookSchema) {}
