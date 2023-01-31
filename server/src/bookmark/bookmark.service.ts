import { FeedService } from 'src/feed/feed.service';
import { Injectable, HttpException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';
import { getUrlMeta } from 'src/util/geturlmeta';
import { RequestBookmarkDto } from './dto/bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly feedService: FeedService,
  ) {}

  async createBookmark(
    requestBookmarkDto: RequestBookmarkDto,
    user: User,
  ): Promise<null> {
    const { feed_id } = requestBookmarkDto;
    try {
      await this.prismaService.$transaction([
        this.prismaService.bookmark.create({
          data: {
            feed_id: feed_id,
            user_email: user.email,
          },
        }),
        this.prismaService.feed.update({
          where: {
            id: feed_id,
          },
          data: {
            updatedAt: new Date(),
          },
        }),
      ]);
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
    return this.feedService.generatedFeed(page, take, user, 2);
  }
}
