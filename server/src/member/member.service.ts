import { Injectable, UseInterceptors } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';

@Injectable()
export class MemberService {
  constructor(private readonly prismaService: PrismaService) {}

  //그룹 만들고 아이디 받아서 업데이트
  async createGroup(user_info, body) {
    const group = await this.prismaService.group.create({
      data: {
        name: body.group_id,
      },
    });
    await this.prismaService.user.update({
      where: { email: user_info.email },
      data: { group_id: group.id },
    });
    return body.group_id;
  }

  //그룹 참가
  async joinGroup(user_info, body) {
    await this.prismaService.user.update({
      where: { email: user_info.email },
      data: { group_id: body.group_id },
    });
    return body.group_id;
  }
}
