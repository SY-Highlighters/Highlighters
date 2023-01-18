import { Injectable, HttpException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';
import { getUrlMeta } from 'src/util/geturlmeta';
import { RequestBookmarkDto } from './dto/bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private readonly prismaService: PrismaService) {}

  async createBookmark(
    requestBookmarkDto: RequestBookmarkDto,
    user: User,
  ): Promise<null> {
    const { feed_id } = requestBookmarkDto;
    try {
      await this.prismaService.bookmark.create({
        data: {
          feed_id: feed_id,
          user_email: user.email,
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
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal Server Error', 500);
    }

    return null;
  }

  async deleteBookmark(bookmark_id: number): Promise<null> {
    try {
      await this.prismaService.bookmark.delete({
        where: {
          id: bookmark_id,
        },
      });
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal Server Error', 500);
    }

    return null;
  }

  async getBookmark(page: number, take: number, user: User) {
    try {
      const count = await this.prismaService.feed.count({
        where: {
          bookmark: {
            some: {
              user_email: user.email,
            },
          },
        },
      });
      const feeds = await this.prismaService.feed.findMany({
        where: {
          bookmark: {
            some: {
              user_email: user.email,
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
}
