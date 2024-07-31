import { Injectable, Logger } from '@nestjs/common';
import { Member } from './entities/member.entity';
import { InternalServerErrorException } from '../../shared/exceptions/InternalServerErrorException';
import { ErrorCode } from '../../shared/exceptions/ErrorCode';
import { MemberRepository } from './members.repository';
import { CreateMemberDto } from './dtos/create-member.dto';
import { EntityManager } from '@mikro-orm/core';
import { NotFoundException } from '../../shared/exceptions/NotFoundException';
import { UpdateMemberDto } from './dtos/update-member.dto';

@Injectable()
export class MembersService {
  readonly #logger = new Logger(MembersService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly em: EntityManager,
  ) {}

  async find(): Promise<Array<Member>> {
    try {
      const members = await this.memberRepository.find(
        {},
        {
          populate: ['borrowedBooks'],
        },
      );

      return members;
    } catch (error) {
      this.#logger.fatal('failed to find', {
        error,
      });

      throw new InternalServerErrorException(
        ErrorCode.InternalServerDatabaseError,
      );
    }
  }

  async create(input: CreateMemberDto): Promise<Member> {
    try {
      const member = new Member(input.name);
      await this.em.persistAndFlush(member);

      return member;
    } catch (error) {
      this.#logger.fatal('failed to create', {
        error,
      });

      throw new InternalServerErrorException(
        ErrorCode.InternalServerDatabaseError,
      );
    }
  }

  async getById(id: string): Promise<Member> {
    try {
      const member = await this.memberRepository.findOne(
        {
          id,
        },
        { populate: ['borrowedBooks'] },
      );
      if (!member) {
        throw new NotFoundException(ErrorCode.MemberNotFound);
      }

      return member;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.#logger.fatal('failed to getById', {
        error,
      });

      throw new InternalServerErrorException(
        ErrorCode.InternalServerDatabaseError,
      );
    }
  }

  async update(id: string, input: UpdateMemberDto): Promise<Member> {
    try {
      const member = await this.memberRepository.findOne({
        id,
      });
      if (!member) {
        throw new NotFoundException(ErrorCode.MemberNotFound);
      }

      if (input.penalizedAt) {
        member.penalizedAt = input.penalizedAt;
      }

      if (input.name) {
        member.name = input.name;
      }

      await this.em.persistAndFlush(member);

      return member;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.#logger.fatal('failed to getById', {
        error,
      });

      throw new InternalServerErrorException(
        ErrorCode.InternalServerDatabaseError,
      );
    }
  }

  async delete(id: string): Promise<Member> {
    try {
      const member = await this.getById(id);

      await this.em.removeAndFlush(member);

      return member;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.#logger.fatal('failed to getById', {
        error,
      });

      throw new InternalServerErrorException(
        ErrorCode.InternalServerDatabaseError,
      );
    }
  }
}
