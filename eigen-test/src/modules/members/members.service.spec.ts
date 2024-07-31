import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';
import { MemberRepository } from './members.repository';
import { Member } from './entities/member.entity';
import mikroOrmConfig from '../../mikro-orm.test.config';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import ErrorMessage from '../../shared/exceptions/ErrorMessage';
import { ErrorCode } from '../../shared/exceptions/ErrorCode';
import { UpdateMemberDto } from './dtos/update-member.dto';
import { CreateMemberDto } from './dtos/create-member.dto';

describe('MembersService Integration', () => {
  let service: MembersService;
  let orm: MikroORM;
  let em: EntityManager;

  beforeAll(async () => {
    orm = await MikroORM.init(mikroOrmConfig());

    em = orm.em.fork();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: MemberRepository,
          useFactory: () => em.getRepository(Member),
        },
        {
          provide: EntityManager,
          useValue: em,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  afterAll(async () => {});

  it('should create and return a member', async () => {
    const createDto = { name: 'Jane Doe' };
    const member = await service.create(createDto);

    expect(member).toBeDefined();
    expect(member.name).toBe(createDto.name);
    expect(member.createdAt).toBeDefined();
    expect(member.id).toBeDefined();
  });

  it('should create and find by id and return a member', async () => {
    expect(service.getById).toBeDefined();

    const createDto = { name: 'Jane Doe' };
    const member = await service.create(createDto);

    expect(member).toBeDefined();
    expect(member.id).toBeDefined();

    const getMemberById = await service.getById(member.id);

    expect(member).toStrictEqual(getMemberById);

    await expect(service.getById('MyCode')).rejects.toThrow(
      ErrorMessage[ErrorCode.MemberNotFound],
    );
  });

  it('should update member', async () => {
    expect(service.getById).toBeDefined();
    expect(service.update).toBeDefined();

    const createDto: CreateMemberDto = { name: 'Jane Doe' };

    const createMember = await service.create(createDto);

    expect(createMember).toBeDefined();
    expect(createMember.name).toEqual(createDto.name);
    expect(createMember.id).toBeDefined();

    const updateDto: UpdateMemberDto = { name: 'Jane Updated' };

    const updatedMember = await service.update(createMember.id, updateDto);
    expect(updatedMember).toBeDefined();
    expect(updatedMember.name).toEqual(updateDto.name);
    expect(updatedMember.id).toEqual(createMember.id);

    const getMemberById = await service.getById(createMember.id);
    expect(getMemberById).toBeDefined();
    expect(getMemberById.id).toEqual(createMember.id);
    expect(getMemberById.name).toEqual(updatedMember.name);
  });

  it('should delete member', async () => {
    expect(service.getById).toBeDefined();
    expect(service.delete).toBeDefined();

    const createDto: CreateMemberDto = { name: 'Jane Doe' };

    const createMember = await service.create(createDto);

    expect(createMember).toBeDefined();
    expect(createMember.name).toEqual(createDto.name);
    expect(createMember.id).toBeDefined();

    const deleteMember = await service.delete(createMember.id);

    expect(deleteMember.id).toEqual(createMember.id);

    await expect(service.getById(createMember.id)).rejects.toThrow(
      ErrorMessage[ErrorCode.MemberNotFound],
    );
  });
});
