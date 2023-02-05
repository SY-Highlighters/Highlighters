import { ElasticsearchService } from 'src/repository/connection';
import { TagService } from './../tag/tag.service';
import { Feed, User, Prisma } from '@prisma/client';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { CreateFeedDto } from './dto/feed.dto';
import { HttpException } from '@nestjs/common/exceptions';
import { Cache } from 'cache-manager';
import { elasticFeedDto } from 'src/repository/dto/elastic.dto';

@Injectable()
export class FeedService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tagService: TagService,
    // private readonly elastic: ElasticsearchService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async createFeed(createFeedDto: CreateFeedDto, user: User): Promise<Feed> {
    const {
      url,
      feed_title,
      og_title,
      image,
      description,
      tag_name,
      high_content,
      type,
      color,
    } = createFeedDto;

    // og 부분
    let _Og = await this.prismaService.og.findFirst({
      where: {
        feed: {
          some: {
            url: url,
            group_id: user.group_id,
          },
        },
      },
    });

    if (!_Og) {
      _Og = await this.prismaService.og.create({
        data: {
          title: og_title,
          image: image,
          description: description,
        },
      });
    }

    const _Feed = await this.prismaService.feed.create({
      data: {
        user_email: user.email,
        group_id: user.group_id,
        url,
        title: feed_title,
        og_id: _Og.id,
      },
    });

    // // elastic input
    // const elasticFeed = new elasticFeedDto();
    // elasticFeed.feed_id = String(_Feed.id);
    // elasticFeed.user_nickname = user.nickname;
    // elasticFeed.group_id = user.group_id;
    // elasticFeed.title = feed_title;
    // elasticFeed.url = url;
    // elasticFeed.description = description;
    // elasticFeed.createdAt = _Feed.createdAt;
    // elasticFeed.image = user.image;
    // if (type == 1) {
    //   elasticFeed.contents = `${color}-${high_content}`;
    // } else {
    //   elasticFeed.contents = `${color}`;
    // }
    // await this.elastic.inputFeed(elasticFeed);

    // tag 부분
    if (tag_name) {
      for (const tag of tag_name) {
        const requestTagCreateDto = {
          tag_name: tag,
          feed_id: _Feed.id,
        };
        await this.tagService.createTag(requestTagCreateDto, user);
      }
    }

    return _Feed;
  }

  async findSepFeedById(page: number, take: number, user: User) {
    return this.generatedFeed(page, take, user, 1);
  }

  async generatedFeed(page: number, take: number, user: User, type: number) {
    let condition;
    if (type == 1) {
      condition = Prisma.validator<Prisma.UserWhereInput>()({
        group_id: user.group_id,
      });
    }
    if (type == 2) {
      condition = Prisma.validator<Prisma.UserWhereInput>()({
        bookmark: {
          some: {
            user_email: user.email,
          },
        },
      });
    }
    try {
      const count = await this.prismaService.feed.count({
        where: condition,
      });

      const feeds = await this.prismaService.feed.findMany({
        where: condition,
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

  async findFeedById(id: number): Promise<Feed> {
    return await this.prismaService.feed.findUnique({
      where: { id },
    });
  }

  async findFeedByGroupId(id: number, user: User): Promise<Feed[]> {
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

    return feeds;
  }

  async findFeedByUserId(user: User): Promise<Feed[]> {
    const feeds = await this.prismaService.feed.findMany({
      where: { user_email: user.email },
      orderBy: { updatedAt: 'desc' },
      include: {
        highlight: true,
        tag: true,
        og: true,
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

    return feeds;
  }

  async deleteFeedById(id: number, user: User): Promise<boolean> {
    const result = await this.prismaService.feed.delete({
      where: { id },
      select: {
        tag: {
          select: {
            id: true,
          },
        },
        createdAt: true,
      },
    });
    await this.prismaService.tag.deleteMany({
      where: {
        id: {
          in: result.tag.map((tag) => tag.id),
        },
      },
    });
    // this.elastic.deleteFeed(String(id));
    let i = 1;
    while (true) {
      const isExist = await this.cacheManager.get(
        `calendar-${user.group_id}-${result.createdAt.getFullYear()}-${
          result.createdAt.getMonth() + 1
        }-${result.createdAt.getDate()}-${i}`,
      );
      if (isExist === null) {
        console.log('deleted all calendar cache');
        break;
      }
      await this.cacheManager.del(
        `calendar-${user.group_id}-${result.createdAt.getFullYear()}-${
          result.createdAt.getMonth() + 1
        }-${result.createdAt.getDate()}-${i}`,
      );
      i++;
    }
    await this.cacheManager.del(
      `showcalendar-${user.group_id}-${result.createdAt.getFullYear()}-${
        result.createdAt.getMonth() + 1
      }`,
    );
    return true;
  }

  async findFeedByUrl(url: string, user: User): Promise<boolean> {
    const result = await this.prismaService.feed.findFirst({
      where: {
        url: url,
        group_id: user.group_id,
      },
    });
    return result ? true : false;
  }
}
