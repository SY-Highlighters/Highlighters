import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findSignInUserGroupInfo(user: User): Promise<object> {
    if (!user.group_id) {
      return user;
    }

    // const cache_group_name = await this.cacheManager.get(
    //   `group-${user.group_id}`,
    // );
    // if (cache_group_name) {
    //   // console.log('[user] cache hit');
    //   return { ...user, group_name: cache_group_name };
    // }
    // // console.log('[user] cache miss');
    const group = await this.prismaService.group.findUnique({
      where: { id: user.group_id },
    });
    // await this.cacheManager.set(`group-${user.group_id}`, group.name);

    return { ...user, group_name: group.name };
  }
}
