import { Injectable, HttpException } from '@nestjs/common';
import { Tag, User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';
import { getUrlMeta } from 'src/util/geturlmeta';
import {
  RequestTagCreateDto,
  RequestTagDeleteDto,
  RequestTagWebDeleteDto,
} from './dto/tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTag(
    createTagDeleteDto: RequestTagCreateDto,
    user: User,
  ): Promise<Tag> {
    const { tag_name, feed_id } = createTagDeleteDto;
    try {
      const tag = await this.prismaService.tag.create({
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
      return tag;
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async deleteTag(
    requestTagDeleteDto: RequestTagDeleteDto,
    user: User,
  ): Promise<null> {
    const { tag_id } = requestTagDeleteDto;
    try {
      await this.prismaService.tag.delete({
        where: {
          id: tag_id,
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

  async deleteTagWeb(
    requestTagwebdeletedto: RequestTagWebDeleteDto,
    user: User,
  ): Promise<null> {
    const { tag_name } = requestTagwebdeletedto;
    try {
      await this.prismaService.tag.deleteMany({
        where: {
          tag_name: tag_name,
          group_id: user.group_id,
        },
      });
      return null;
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async searchTag(tag_name: string, user: User): Promise<object[]> {
    const feeds = await this.prismaService.feed.findMany({
      where: {
        group_id: user.group_id,
        tag: {
          some: {
            tag_name: tag_name,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        highlight: {
          include: {
            user: {
              select: {
                nickname: true,
                image: true,
              },
            },
          },
          orderBy: {
            user_email: 'asc',
            createdAt: 'asc',
          },
        },
        tag: true,
        og: true,
        user: {
          select: {
            nickname: true,
            image: true,
          },
        },
        bookmark: {
          where: {
            user_email: user.email,
          },
          select: {
            id: true,
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
