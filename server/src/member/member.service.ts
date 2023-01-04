import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';
import { CreateGroupDto } from './dto/group.dto';

@Injectable()
export class MemberService {
  constructor(private readonly prismaService: PrismaService) {}

  //그룹 만들고 아이디 받아서 업데이트
  async createGroup(createGroupDto: CreateGroupDto): Promise<number> {
    const { user_email, name } = createGroupDto;
    const newGroup = await this.prismaService.group.create({ data: { name } });

    if (!newGroup) {
      throw new NotFoundException(`Create Group Fail`);
    }

    const joinGroup = await this.joinGroup(user_email, newGroup.id);

    return joinGroup;
  }

  //그룹 참가
  async joinGroup(user_email: string, id: number): Promise<number> {
    const update_user = await this.prismaService.user.update({
      where: { email: user_email },
      data: { group_id: id },
    });

    if (!update_user) {
      throw new NotFoundException(`Join Group Fail`);
    }

    return update_user.group_id;
  }

  async findAllMemberInMyGroup(id: number): Promise<User[]> {
    const members = this.prismaService.user.findMany({
      where: { group_id: id },
    });

    return members;
  }
}
