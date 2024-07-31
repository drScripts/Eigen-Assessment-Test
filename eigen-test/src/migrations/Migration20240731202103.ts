import { Migration } from '@mikro-orm/migrations';

export class Migration20240731202103 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `books` (`id` varchar(255) not null, `title` varchar(255) not null, `author` varchar(255) not null, `stock` int not null, `available` int null, `created_at` datetime not null, `updated_at` datetime not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;',
    );

    this.addSql(
      'create table `members` (`id` varchar(255) not null, `name` varchar(255) not null, `created_at` datetime not null, `borrowed_books_count` int null, `updated_at` datetime not null, `penalized_at` datetime null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;',
    );

    this.addSql(
      'create table `member_books_borrowed` (`id` varchar(255) not null, `member_id` varchar(255) null, `book_id` varchar(255) null, `borrowed_at` datetime not null, `returned_at` datetime null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql(
      'alter table `member_books_borrowed` add index `member_books_borrowed_member_id_index`(`member_id`);',
    );
    this.addSql(
      'alter table `member_books_borrowed` add index `member_books_borrowed_book_id_index`(`book_id`);',
    );

    this.addSql(
      'alter table `member_books_borrowed` add constraint `member_books_borrowed_member_id_foreign` foreign key (`member_id`) references `members` (`id`) on update cascade on delete set null;',
    );
    this.addSql(
      'alter table `member_books_borrowed` add constraint `member_books_borrowed_book_id_foreign` foreign key (`book_id`) references `books` (`id`) on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `member_books_borrowed` drop foreign key `member_books_borrowed_book_id_foreign`;',
    );

    this.addSql(
      'alter table `member_books_borrowed` drop foreign key `member_books_borrowed_member_id_foreign`;',
    );

    this.addSql('drop table if exists `books`;');

    this.addSql('drop table if exists `members`;');

    this.addSql('drop table if exists `member_books_borrowed`;');
  }
}
