import { Injectable, HttpException } from '@nestjs/common';
import { Noti } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';
import { CreateNotiDto } from './dto/noti.dto';

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
    for (let i = 0; i < users.member.length; i++) {
      if (users.member[i].email !== user_email) {
        try {
          await this.prismaService.noti.create({
            data: {
              contents: contents,
              user_id: users.member[i].email,
              feed_id: feed_id.id,
            },
          });
          result += 1;
        } catch (e) {
          console.log(e);
          throw new HttpException('Internal Server Error', 500);
        }
      }
    }

    return result;
  }
}
