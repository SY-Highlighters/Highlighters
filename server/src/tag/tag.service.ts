import { Injectable, HttpException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';
import { getUrlMeta } from 'src/util/geturlmeta';
import { RequestTagCreateDto, RequestTagDeleteDto } from './dto/tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTag(
    createTagDeleteDto: RequestTagCreateDto,
    user: User,
  ): Promise<null> {
    const { tag_name, feed_id } = createTagDeleteDto;
    try {
      await this.prismaService.tag.create({
        data: {
          tag_name: tag_name,
          feed: {
            connect: {
              id: feed_id,
            },
          },
          group: {
            connect: {
              id: user.group_id,
            },
          },
        },
      });
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal Server Error', 500);
    }

    return null;
  }

  async deleteTag(
    requestTagDeleteDto: RequestTagDeleteDto,
    user: User,
  ): Promise<null> {
    const { tag_id, feed_id } = requestTagDeleteDto;
    try {
      await this.prismaService.tag.update({
        where: {
          id: tag_id,
        },
        data: {
          feed: {
            disconnect: {
              id: feed_id,
            },
          },
        },
      });
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal Server Error', 500);
    }

    return null;
  }

  async getTag(user: User): Promise<object[]> {
    const tags = await this.prismaService.tag.findMany({
      where: {
        group_id: user.group_id,
      },
      distinct: ['tag_name'],
      select: {
        id: true,
        tag_name: true,
      },
    });
    return tags;
  }

  async deleteTagWeb(tag_id: number, user: User): Promise<null> {
    try {
      await this.prismaService.tag.delete({
        where: {
          id: tag_id,
        },
      });
      return null;
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async searchTag(tag_id: number, user: User): Promise<object[]> {
    const feeds = await this.prismaService.feed.findMany({
      where: {
        group_id: user.group_id,
        // tag: {
        //   some: {
        //     id: {
        //       equals: tag_id,
        //     },
        //   },
        tag: {
          every: {
            id: tag_id,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        highlight: true,
        tag: true,
      },
    });
    console.log(feeds);
    const feedswithOg: object[] = [];
    for (const feed of feeds) {
      if (feed.url) {
        const meta = await getUrlMeta(feed.url);
        // 존재하지 않는다면 임의의 값 넣기
        if (meta.title === undefined) {
          meta.title = 'No Title';
        }
        if (meta.desc === undefined) {
          meta.desc = 'No Description';
        }
        if (meta.image === undefined) {
          meta.image =
            'https://img.favpng.com/23/20/7/computer-icons-information-png-favpng-g8DtjAPPNhyaU9EdjHQJRnV97_t.jpg';
        }
        const feedwithOg = {
          ...feed,
          og_title: meta.title,
          og_desc: meta.desc,
          og_image: meta.image,
        };
        feedswithOg.push(feedwithOg);
      }
    }

    return feedswithOg;
  }

  async getTagByFeedId(feed_id: number): Promise<string[]> {
    const tags = await this.prismaService.tag.findMany({
      where: {
        feed: {
          some: {
            id: feed_id,
          },
        },
      },
    });
    return tags.map((tag) => tag.tag_name);
  }
}
