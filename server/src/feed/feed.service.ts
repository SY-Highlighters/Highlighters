import { Feed, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { getUrlMeta } from 'src/util/geturlmeta';
import { CreateFeedDto } from './dto/feed.dto';

@Injectable()
export class FeedService {
  constructor(private readonly prismaService: PrismaService) {}

  async createFeed(createFeedDto: CreateFeedDto): Promise<Feed> {
    const { user_email, group_id, url, title, image, description } =
      createFeedDto;
    const iscreate = await this.prismaService.og.findFirst({
      where: {
        feed: {
          some: {
            url: url,
            group_id: group_id,
          },
        },
      },
    });
    let makecreate = null;
    if (!iscreate) {
      makecreate = await this.prismaService.og.create({
        data: {
          title: title,
          image: image,
          description: description,
        },
      });
    }
    const result = await this.prismaService.feed.create({
      data: {
        user_email,
        group_id,
        url,
        title,
        og_id: iscreate ? iscreate.id : makecreate.id,
      },
    });

    return result;
  }

  async findFeedById(id: number): Promise<Feed> {
    return await this.prismaService.feed.findUnique({
      where: { id },
    });
  }

  async findFeedByGroupId(id: number): Promise<Feed[]> {
    const feeds = await this.prismaService.feed.findMany({
      where: { group_id: id },
      orderBy: { updatedAt: 'desc' },
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

    return feeds;
  }

  async findGroupFeedWithOg(id: number): Promise<object[]> {
    const feeds = await this.findFeedByGroupId(id);
    // const feedswithOg: object[] = [];
    // for (const feed of feeds) {
    //   if (feed.url) {
    //     try {
    //       const meta = await getUrlMeta(feed.url);
    //       const feedwithOg = {
    //         ...feed,
    //         og_title: meta.title,
    //         og_desc: meta.desc,
    //         og_image: meta.image,
    //       };
    //       feedswithOg.push(feedwithOg);
    //     } catch (e) {
    //       const feedwithOg = {
    //         ...feed,
    //         og_title: 'Untitled',
    //         og_desc: '',
    //         og_image:
    //           'https://img.favpng.com/23/20/7/computer-icons-information-png-favpng-g8DtjAPPNhyaU9EdjHQJRnV97_t.jpg',
    //       };
    //       feedswithOg.push(feedwithOg);
    //     }
    //   }
    // }

    return feeds;
  }

  async deleteFeedById(id: number): Promise<Feed> {
    const result = await this.prismaService.feed.delete({
      where: { id },
    });

    return result;
  }

  async findFeedByUrl(url: JSON, user: User): Promise<Feed | null> {
    const url_ = url['url'];
    const result = await this.prismaService.feed.findFirst({
      where: {
        url: url_,
        group_id: user.group_id,
      },
    });
    return result;
  }
}
