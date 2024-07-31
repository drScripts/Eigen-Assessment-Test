import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '../../shared/decorators/response';
import { Member } from './entities/member.entity';
import { DataResponse } from '../../shared/types/DataResponse';
import { MembersService } from './members.service';
import { CreateMemberDto, createMemberSchema } from './dtos/create-member.dto';
import { ZodValidationPipe } from '../../shared/pipes/zodValidationPipe';
import { UpdateMemberDto, updateMemberSchema } from './dtos/update-member.dto';
import { MemberBooksBorrowed } from '../member-books-borrowed/entities/member-books-borrowed.entity';
import { BorrowBookDto, borrowBookSchema } from './dtos/borrow-book.dto';
import { ReturnBookDto, returnBookSchema } from './dtos/return-book.dto';
import { MemberBooksBorrowedService } from '../member-books-borrowed/member-books-borrowed.service';

@Controller('members')
@ApiTags('members')
export class MembersController {
  constructor(
    private readonly memberService: MembersService,
    private readonly memberBookBorrowedService: MemberBooksBorrowedService,
  ) {}

  @Get()
  @ApiResponse(Member, true)
  async find(): Promise<DataResponse<Array<Member>>> {
    const members = await this.memberService.find();
    const membersWithBorrowedBooks = members.map(member => {
      const borrowedBooksCount = member.borrowedBooks.getItems().filter(
        (borrow: MemberBooksBorrowed) => !borrow.returnedAt
      ).length;

      const newMember: Member = { ...member, borrowedBooks: undefined, borrowedBooksCount: borrowedBooksCount }

      return newMember;
    });

    return new DataResponse(membersWithBorrowedBooks);
  }

  @Get(':id')
  @ApiResponse(Member)
  async getById(@Param('id') id: string): Promise<DataResponse<Member>> {
    const member = await this.memberService.getById(id);

    const borrowedBooksCount = member.borrowedBooks.getItems().filter(
      borrow => !borrow.returnedAt
    ).length;

    const newMember: Member = { ...member, borrowedBooks: undefined, borrowedBooksCount: borrowedBooksCount }
 

    return new DataResponse(newMember);
  }

  @Post()
  @ApiResponse(Member)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createMemberSchema))
  async create(@Body() body: CreateMemberDto): Promise<DataResponse<Member>> {
    const member = await this.memberService.create(body);
    return new DataResponse(member);
  }

  @Patch(':id')
  @ApiResponse(Member)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateMemberSchema))
  async update(
    @Param('id') id: string,
    @Body() body: UpdateMemberDto,
  ): Promise<DataResponse<Member>> {
    const member = await this.memberService.update(id, body);
    return new DataResponse(member);
  }

  @Delete(':id')
  @ApiResponse(Member)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<DataResponse<Member>> {
    const member = await this.memberService.delete(id);
    return new DataResponse(member);
  }

  @Post(':id/borrow-books')
  @ApiResponse(MemberBooksBorrowed, true)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(borrowBookSchema))
  async borrowBooks(
    @Param('id') id: string,
    @Body() body: BorrowBookDto,
  ): Promise<DataResponse<Array<MemberBooksBorrowed>>> {
    const book = await this.memberBookBorrowedService.borrowBook(
      id,
      body.bookIds,
    );
    return new DataResponse(book);
  }

  @Post(':id/return-books')
  @ApiResponse(MemberBooksBorrowed, true)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(returnBookSchema))
  async returnBooks(
    @Param('id') id: string,
    @Body() body: ReturnBookDto,
  ): Promise<DataResponse<Array<MemberBooksBorrowed>>> {
    const book = await this.memberBookBorrowedService.returnBook(
      id,
      body.bookIds,
    );
    return new DataResponse(book);
  }
}
