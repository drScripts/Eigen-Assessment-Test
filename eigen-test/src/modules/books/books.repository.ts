import { EntityRepository } from '@mikro-orm/mysql';
import { Book } from './entities/book.entity';

export class BookRepository extends EntityRepository<Book> {
  async findByCodes(bookIds: Array<string>): Promise<Book[]> {
    return this.find({
      id: {
        $in: bookIds,
      },
    });
  }
}
