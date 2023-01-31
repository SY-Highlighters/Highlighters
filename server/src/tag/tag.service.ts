import { FeedService } from 'src/feed/feed.service';
import { Injectable, HttpException } from '@nestjs/common';
import { Tag, User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';
import { getUrlMeta } from 'src/util/geturlmeta';
import {
  RequestTagCreateDto,
  RequestTagDeleteDto,
  RequestTagPost,
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
      const isTag = await this.prismaService.tag.findFirst({
        where: {
          group_id: user.group_id,
          tag_name: tag_name,
          feed: {
            some: {
              id: feed_id,
            },
          },
        },
      });
      if (isTag) {
        throw new HttpException('Tag already exists', 400);
      }

      const tag = await this.prismaService.tag.create({
        data: {
          tag_name: tag_name,
          group_id: user.group_id,
          feed: {
            connect: {
              id: feed_id,
            },
          },
        },
      });

      await this.prismaService.feed.update({
        where: {
          id: feed_id,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      return tag;
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async deleteTag(requestTagDeleteDto: RequestTagDeleteDto): Promise<null> {
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
    const tags = await this.prismaService.tag.groupBy({
      by: ['tag_name'],
      _count: {
        tag_name: true,
      },
      orderBy: {
        _count: {
          tag_name: 'desc',
        },
      },
      where: {
        group_id: user.group_id,
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

  async searchTag(page: number, take: number, tag_name: string, user: User) {
    try {
      const count = await this.prismaService.feed.count({
        where: {
          group_id: user.group_id,
          tag: {
            some: {
              tag_name: tag_name,
            },
          },
        },
      });
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
        take: take,
        skip: take * (page - 1),
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
            orderBy: [
              {
                user_email: 'asc',
              },
              {
                createdAt: 'asc',
              },
            ],
          },
          tag: true,
          og: true,
          user: {
            select: {
              nickname: true,
              image: true,
            },
          },
          comment: {
            orderBy: { createdAt: 'desc' },
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
      return {
        currentPage: page,
        totalPage: Math.ceil(count / take),
        feeds,
      };
    } catch (e) {
      throw new HttpException('Internal Server Error', 500);
    }
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

  async updateTag(
    requestTagPost: RequestTagPost,
    user: User,
  ): Promise<boolean> {
    const { delete_tag_id, create_tag_name, feed_id } = requestTagPost;
    try {
      await this.prismaService.tag.deleteMany({
        where: {
          id: {
            in: delete_tag_id,
          },
        },
      });
      for (let i = 0; i < create_tag_name.length; i++) {
        await this.prismaService.tag.create({
          data: {
            tag_name: create_tag_name[i],
            group_id: user.group_id,
            feed: {
              connect: {
                id: feed_id,
              },
            },
          },
        });
      }
      await this.prismaService.feed.update({
        where: {
          id: feed_id,
        },
        data: {
          updatedAt: new Date(),
        },
      });
      return true;
    } catch (e) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
