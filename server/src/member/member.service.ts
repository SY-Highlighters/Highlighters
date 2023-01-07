import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { CreateGroupDto } from './dto/group.dto';

@Injectable()
export class MemberService {
  constructor(private readonly prismaService: PrismaService) {}

  //그룹 만들고 아이디 받아서 업데이트
  async createGroup(createGroupDto: CreateGroupDto): Promise<number> {
    const { user_email, name } = createGroupDto;
    const newGroup = await this.prismaService.group.create({
      data: {
        name,
        group_code: Math.floor(Math.random() * 10000000000)
          .toString(16)
          .padStart(10, '0'),
      },
    });

    if (!newGroup) {
      throw new NotFoundException(`Create Group Fail`);
    }

    const joinGroup = await this.joinGroup(user_email, newGroup.group_code);

    return joinGroup;
  }

  //그룹 참가
  async joinGroup(user_email: string, group_code: string): Promise<number> {
    const group = await this.prismaService.group.findFirst({
      where: { group_code },
    });

    if (!group) {
      throw new NotFoundException(`Wrong Group Code`);
    }

    const update_user = await this.prismaService.user.update({
      where: { email: user_email },
      data: { group_id: group.id },
    });

    if (!update_user) {
      throw new Error(`Join Group Fail`);
    }

    return update_user.group_id;
  }

  async getGroupCode(group_id: number): Promise<string> {
    const group = await this.prismaService.group.findUnique({
      where: { id: group_id },
    });

    if (!group) {
      throw new NotFoundException(`Group Not Found`);
    }

    return group.group_code;
  }
}
