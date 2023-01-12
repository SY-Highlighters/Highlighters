import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';
import { getUrlMeta } from 'src/util/geturlmeta';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async showCalendar(user: User, server_date: Date): Promise<object[]> {
    const date = new Date(server_date + '00:09:00');
    const feeds = await this.prisma.feed.findMany({
      where: {
        group_id: user.group_id,
        createdAt: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        highlight: true,
        tag: true,
        og: true,
        user: {
          select: {
            nickname: true,
            image: true,
          },
        },
      },
    });
    // const feedswithOg: object[] = [];
    // for (const feed of feeds) {
    //   if (feed.url) {
    //     const meta = await getUrlMeta(feed.url);
    //     // 존재하지 않는다면 임의의 값 넣기
    //     if (meta.title === undefined) {
    //       meta.title = 'No Title';
    //     }
    //     if (meta.desc === undefined) {
    //       meta.desc = 'No Description';
    //     }
    //     if (meta.image === undefined) {
    //       meta.image =
    //         'https://img.favpng.com/23/20/7/computer-icons-information-png-favpng-g8DtjAPPNhyaU9EdjHQJRnV97_t.jpg';
    //     }
    //     const feedwithOg = {
    //       ...feed,
    //       og_title: meta.title,
    //       og_desc: meta.desc,
    //       og_image: meta.image,
    //     };
    //     feedswithOg.push(feedwithOg);
    //   }
    // }
    return feeds;
  }
}
