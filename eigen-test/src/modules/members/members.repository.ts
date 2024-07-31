import { EntityRepository } from '@mikro-orm/mysql';
import { Member } from './entities/member.entity';

export class MemberRepository extends EntityRepository<Member> {}
