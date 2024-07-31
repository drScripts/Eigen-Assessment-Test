import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string(),
  author: z.string(),
  stock: z.number(),
});

export class CreateBookDto extends createZodDto(createBookSchema) { }
