import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const borrowBookSchema = z.object({
  bookIds: z.array(z.string()),
});

export class BorrowBookDto extends createZodDto(borrowBookSchema) {}
