import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { MembersModule } from './modules/members/members.module';
import { BooksModule } from './modules/books/books.module';
import { MemberBooksBorrowedModule } from './modules/member-books-borrowed/member-books-borrowed.module';
import mikroOrmConfig from './mikro-orm.config';
import { confgValueFromNodeEnv } from './shared/configs';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot(mikroOrmConfig(confgValueFromNodeEnv())),
    MembersModule,
    BooksModule,
    MemberBooksBorrowedModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
