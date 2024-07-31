import { forwardRef, Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Member } from './entities/member.entity';
import { MemberBooksBorrowedModule } from '../member-books-borrowed/member-books-borrowed.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Member]),
    forwardRef(() => MemberBooksBorrowedModule),
  ],
  providers: [MembersService],
  controllers: [MembersController],
  exports: [MembersService],
})
export class MembersModule {}
