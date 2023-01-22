import { Injectable, HttpException } from '@nestjs/common';
import { User } from '@prisma/client';
import { EventGateway } from 'src/event/event.gateway';
import { PrismaService } from 'src/repository/prisma.service';
import { CreateNotiDto, DeleteNotiDto, ShowNotiDto } from './dto/noti.dto';

@Injectable()
export class NotiService {
  constructor(
    private readonly prismaService: PrismaService,
    private event: EventGateway,
  ) {}

  async createNoti(createNotiDto: CreateNotiDto): Promise<number> {
    const { user_email, group_id, nickname, contents, url } = createNotiDto;

    const feed_ = await this.prismaService.feed.findFirst({
      where: { group_id: group_id, url: url },
      include: {
        group: {
          include: { member: { select: { email: true } } },
        },
      },
    });

    let result = 0;
    try {
      for (let i = 0; i < feed_.group.member.length; i++) {
        await this.prismaService.noti.create({
          data: {
            contents: contents,
            receiver_id: feed_.group.member[i].email,
            sender_id: user_email,
            feed_id: feed_.id,
          },
        });
        if (feed_.group.member[i].email === user_email) {
          continue;
        }
        await this.prismaService.user.update({
          where: { email: feed_.group.member[i].email },
          data: { new_noti: true },
        });
        result += 1;
      }

      console.log('===== [WebSocket] Send Push =====');
      this.event.group_room[group_id].forEach((client) => {
        console.log(client['email'], user_email);
        if (client['email'] === user_email) return;
        client.send(
          JSON.stringify({
            event: 'push',
            data: {
              user_email,
              group_id: group_id,
              nickname,
              contents: contents,
              url: url,
            },
          }),
        );
      });
    } catch (e) {
      throw new HttpException('Internal Server Error', 500);
    }

    return result;
  }

  async deleteNoti(noti_id: number[]): Promise<null> {
    try {
      for (let i = 0; i < noti_id.length; i++) {
        console.log(noti_id[i]);
        await this.prismaService.noti.delete({
          where: {
            id: noti_id[i],
          },
        });
      }
      return null;
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async deleteAllNoti(user: User): Promise<null> {
    try {
      await this.prismaService.noti.deleteMany({
        where: {
          receiver_id: user.email,
        },
      });
      return null;
    } catch (e) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async findNotiWeb(user: User, page: number, take: number) {
    try {
      const count = await this.prismaService.noti.count({
        where: { receiver_id: user.email },
      });
      const noties = await this.prismaService.noti.findMany({
        where: { receiver_id: user.email },
        orderBy: { createdAt: 'desc' },
        include: { feed: true, sender: true },
        take: take,
        skip: (page - 1) * take,
      });
      const result: ShowNotiDto[] = [];
      for (let i = 0; i < noties.length; i++) {
        // await this.prismaService.noti.update({
        //   where: { id: noties[i].id },
        //   data: { isRead: true },
        // });
        result.push({
          id: noties[i].id,
          contents: noties[i].contents,
          nickname: noties[i].sender.nickname,
          feed_id: noties[i].feed_id,
          title: noties[i].feed.title,
          url: noties[i].feed.url,
          createdAt: noties[i].createdAt,
        });
      }
      return {
        totalcount: count,
        currentPage: page,
        totalPage: Math.ceil(count / take),
        data: result,
      };
    } catch (e) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async findNotiExtension(user: User): Promise<ShowNotiDto[]> {
    const noties = await this.prismaService.noti.findMany({
      where: {
        receiver_id: user.email,
        sender_id: { not: user.email },
        isRead: false,
      },
      orderBy: { createdAt: 'desc' },
      include: { feed: true, sender: true },
    });
    const result: ShowNotiDto[] = [];
    try {
      for (let i = 0; i < noties.length; i++) {
        // if (user.email === noties[i].sender_id) continue;
        // await this.prismaService.noti.update({
        //   where: { id: noties[i].id },
        //   data: { isRead: true },
        // });
        result.push({
          id: noties[i].id,
          contents: noties[i].contents,
          nickname: noties[i].sender.nickname,
          feed_id: noties[i].feed_id,
          title: noties[i].feed.title,
          url: noties[i].feed.url,
          createdAt: noties[i].createdAt,
        });
      }
    } catch (e) {
      throw new HttpException('Internal Server Error', 500);
    }

    return result;
  }

  async readNoti(noti_id: number): Promise<null> {
    try {
      await this.prismaService.noti.update({
        where: { id: noti_id },
        data: { isRead: true },
      });
    } catch (e) {
      throw new HttpException('Internal Server Error', 500);
    }
    return null;
  }

  async checkNewNoti(user: User): Promise<boolean> {
    try {
      await this.prismaService.user.update({
        where: { email: user.email },
        data: { new_noti: false },
      });
      return true;
    } catch (e) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
