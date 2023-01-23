import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findSignInUserGroupInfo(user: User): Promise<object> {
    if (!user.group_id) {
      return user;
    }

    const group = await this.prismaService.group.findUnique({
      where: { id: user.group_id },
    });
    return { ...user, group_name: group.name };
  }
}
