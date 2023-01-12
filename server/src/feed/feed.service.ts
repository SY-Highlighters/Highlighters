import { TagService } from './../tag/tag.service';
import { Feed, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { getUrlMeta } from 'src/util/geturlmeta';
import { CreateFeedDto } from './dto/feed.dto';
import { HttpException } from '@nestjs/common/exceptions';

@Injectable()
export class FeedService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tagService: TagService,
  ) {}

  async createFeed(createFeedDto: CreateFeedDto, user: User): Promise<number> {
    const { url, feed_title, og_title, image, description, tag_name } =
      createFeedDto;

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

    // tag 부분
    if (tag_name) {
      for (const tag of tag_name) {
        const requestTagCreateDto = {
          tag_name: tag,
          feed_id: _Feed.id,
        };
        const _Tag = await this.tagService.createTag(requestTagCreateDto, user);
      }
    }

    return _Feed.id;
  }

  async findSepFeedById(page: number, take: number, user: User) {
    try {
      const count = await this.prismaService.feed.count({
        where: { group_id: user.group_id },
      });
      const feeds = await this.prismaService.feed.findMany({
        where: { group_id: user.group_id },
        orderBy: { updatedAt: 'desc' },
        take: take,
        skip: take * (page - 1),
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
