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

  async getBookmark(user: User): Promise<object[]> {
    try {
      const feeds = await this.prismaService.feed.findMany({
        where: {
          bookmark: {
            some: {
              user_email: user.email,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
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
            orderBy: {
              createdAt: 'desc',
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
      return feeds;
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
