import { PartialType } from '@nestjs/swagger';
import { CreateMemberBooksBorrowedDto } from './create-member-books-borrowed.dto';

export class UpdateMemberBooksBorrowedDto extends PartialType(
  CreateMemberBooksBorrowedDto,
) {}
