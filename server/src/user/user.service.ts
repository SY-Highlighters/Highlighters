import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findSignInUserGroupInfo(email: string): Promise<object> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.group_id) {
      return user;
    }

    const group = await this.prismaService.group.findUnique({
      where: { id: user.group_id },
    });

    return { ...user, group_name: group.name };
  }

  async findGroupUsersByGroupId(id: number): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      where: { group_id: id },
    });

    return users;
  }
}
