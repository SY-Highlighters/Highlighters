import { Injectable, HttpException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';
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
      const bookmark = await this.prismaService.bookmark.findMany({
        where: {
          user_email: user.email,
        },
        select: {
          feed: {
            select: {
              id: true,
              title: true,
              url: true,
              createdAt: true,
              updatedAt: true,
              highlight_id: {
                select: {
                  id: true,
                  selection: true,
                  contents: true,
                  color: true,
                  type: true,
                },
                orderBy: {
                  id: 'desc',
                },
              },
              tag: {
                select: {
                  tag_name: true,
                },
              },
            },
          },
        },
      });

      return bookmark;
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
