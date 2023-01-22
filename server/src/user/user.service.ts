import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findSignInUserGroupInfo(email: string): Promise<object> {
    console.log('[findSignInUserGroupInfo]');
    const cache_user: User = await this.cacheManager.get(`user-${email}`);
    if (cache_user) {
      console.log('[user] cache hit');
      if (!cache_user.group_id) {
        return cache_user;
      }
      const cache_group_name = await this.cacheManager.get(
        `group_name-${cache_user.group_id}`,
      );
      if (cache_group_name) {
        console.log('[group_name] cache hit');
        return { ...cache_user, group_name: cache_group_name };
      } else {
        console.log('[group_name] cache miss');
        const group = await this.prismaService.group.findUnique({
          where: { id: cache_user.group_id },
        });
        await this.cacheManager.set(
          `group_name-${cache_user.group_id}`,
          group.name,
          0,
        );
        return { ...cache_user, group_name: group.name };
      }
    }
    console.log('[user] cache miss');
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    await this.cacheManager.set(`user-${email}`, user, 0);

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

  async findGroupUsersInfoByGroupId(id: number): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      where: { group_id: id },
    });

    return users;
  }
}
