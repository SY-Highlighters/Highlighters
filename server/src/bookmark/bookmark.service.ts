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
      const bookmarks = await this.prismaService.bookmark.findMany({
        where: {
          user_email: user.email,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          feed: {
            include: {
              highlight: true,
              tag: true,
              og: true,
            },
          },
        },
      });
      // const feedswithOg: object[] = [];
      // for (const bookmark of bookmarks) {
      //   if (bookmark.feed.url) {
      //     const meta = await getUrlMeta(bookmark.feed.url);
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
      //       ...bookmark,
      //       og_title: meta.title,
      //       og_desc: meta.desc,
      //       og_image: meta.image,
      //     };
      //     feedswithOg.push(feedwithOg);
      //   }
      // }
      // return feedswithOg;
      return bookmarks;
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
