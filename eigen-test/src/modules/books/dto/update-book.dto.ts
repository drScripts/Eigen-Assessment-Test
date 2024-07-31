import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const updateBookSchema = z.object({
  author: z.string().nullish(),
  title: z.string().nullish(),
  stock: z.number().nullish(),
});

export class UpdateBookDto extends createZodDto(updateBookSchema) {}
