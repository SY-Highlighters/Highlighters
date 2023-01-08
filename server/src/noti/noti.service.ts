import { Injectable, HttpException } from '@nestjs/common';
import { Noti, User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';
import { CreateNotiDto, ShowNotiDto } from './dto/noti.dto';

@Injectable()
export class NotiService {
  constructor(private readonly prismaService: PrismaService) {}

  async createNoti(createNotiDto: CreateNotiDto): Promise<number> {
    const { user_email, group_id, nickname, contents, url } = createNotiDto;

    const feed_id = await this.prismaService.feed.findFirst({
      where: { group_id: group_id, url: url },
      select: { id: true },
    });

    const users = await this.prismaService.group.findUnique({
      where: { id: group_id },
      select: { member: { select: { email: true } } },
    });

    let result = 0;
    try {
      for (let i = 0; i < users.member.length; i++) {
        await this.prismaService.noti.create({
          data: {
            contents: contents,
            user_id: users.member[i].email,
            feed_id: feed_id.id,
          },
        });
        result += 1;
      }
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal Server Error', 500);
    }

    return result;
  }

  async deleteNoti(
    noti_id: number,
    user_id: string,
    user: User,
  ): Promise<null> {
    if (user.email !== user_id) {
      throw new HttpException('Forbidden', 403);
    }

    const result = await this.prismaService.noti.delete({
      where: { id: noti_id },
    });

    if (!result) {
      throw new HttpException('Not Found', 404);
    }

    return;
  }

  async findNotiWeb(user: User): Promise<ShowNotiDto[]> {
    const noties = await this.prismaService.noti.findMany({
      where: { user_id: user.email },
      orderBy: { createdAt: 'desc' },
    });
    const result: ShowNotiDto[] = [];
    try {
      for (let i = 0; i < noties.length; i++) {
        const sender = await this.prismaService.user.findUnique({
          where: { email: noties[i].user_id },
          select: { nickname: true },
        });
        const feed = await this.prismaService.feed.findUnique({
          where: { id: noties[i].feed_id },
          select: { title: true, url: true },
        });
        result.push({
          id: noties[i].id,
          contents: noties[i].contents,
          user_id: noties[i].user_id,
          nickname: sender.nickname,
          feed_id: noties[i].feed_id,
          title: feed.title,
          url: feed.url,
          createdAt: noties[i].createdAt,
        });
      }
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal Server Error', 500);
    }

    return result;
  }

  async findNotiExtension(user: User): Promise<ShowNotiDto[]> {
    const noties = await this.prismaService.noti.findMany({
      where: { user_id: user.email, isRead: false },
      orderBy: { createdAt: 'desc' },
    });
    const result: ShowNotiDto[] = [];
    try {
      for (let i = 0; i < noties.length; i++) {
        if (user.email === noties[i].user_id) continue;
        const sender = await this.prismaService.user.findUnique({
          where: { email: noties[i].user_id },
          select: { nickname: true },
        });
        const feed = await this.prismaService.feed.findUnique({
          where: { id: noties[i].feed_id },
          select: { title: true, url: true },
        });
        await this.prismaService.noti.update({
          where: { id: noties[i].id },
          data: { isRead: true },
        });
        result.push({
          id: noties[i].id,
          contents: noties[i].contents,
          user_id: noties[i].user_id,
          nickname: sender.nickname,
          feed_id: noties[i].feed_id,
          title: feed.title,
          url: feed.url,
          createdAt: noties[i].createdAt,
        });
      }
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal Server Error', 500);
    }

    return result;
  }
}
