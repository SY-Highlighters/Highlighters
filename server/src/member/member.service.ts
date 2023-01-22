import { User } from '@prisma/client';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { CreateGroupDto, showUserDto } from './dto/group.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class MemberService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

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

    // 그룹 생성하면 group_name을 캐시에 저장
    await this.cacheManager.set(`group_name-${newGroup.id}`, name, 0);

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

    // 그룹에 참여하면 유저 정보를 캐시에 저장
    await this.cacheManager.set(`user-${user_email}`, update_user, 0); // ttl 0: 무한

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

  // 그룹 멤버 리스트 프사띄우기
  async getGroupMembers(user: User): Promise<showUserDto[]> {
    if (!user.group_id) {
      return [];
    }

    const members = await this.prismaService.user.findMany({
      where: {
        NOT: { email: user.email },
        group_id: user.group_id,
      },
      select: {
        email: true,
        nickname: true,
        image: true,
      },
    });

    if (!members) {
      throw new NotFoundException(`Group Members Not Found`);
    }

    return members;
  }
}
