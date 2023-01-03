import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';

@Injectable()
export class MemberService {
  constructor(private readonly prismaService: PrismaService) {}

  //그룹 만들고 아이디 받아서 업데이트
  async createGroup(createGroupDto: CreateGroupDto): Promise<number> {
    const newGroup = await this.prismaService.group.create({
      data: {
        name: createGroupDto.name,
      },
    });

    if (!newGroup) {
      throw new NotFoundException(`Create Group Fail`);
    }

    const newUpdateGroupDto = new UpdateGroupDto();
    newUpdateGroupDto.user_email = createGroupDto.user_email;
    newUpdateGroupDto.group_id = newGroup.id;

    const joinGroup = await this.joinGroup(newUpdateGroupDto);

    return joinGroup;
  }

  //그룹 참가
  async joinGroup(updateGroupDto: UpdateGroupDto): Promise<number> {
    const { user_email, group_id } = updateGroupDto;

    const update_user = await this.prismaService.user.update({
      where: { email: user_email },
      data: { group_id: group_id },
    });

    if (!update_user) {
      throw new NotFoundException(`Join Group Fail`);
    }

    return update_user.group_id;
  }
}
