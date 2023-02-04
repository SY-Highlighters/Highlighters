import { ElasticsearchService } from './../repository/connection';
import { User, Highlight } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';

@Injectable()
export class SearchService {
  constructor(
    // private readonly elastic: ElasticsearchService,
    private readonly prismaService: PrismaService,
  ) {}

  // async find(word: string, user: User): Promise<object[] | void> {
  //   return await this.elastic.findFeed(word, user);
  // }

  async findtest(word: string, user: User): Promise<object[] | void> {
    // const word_arr = word.split(' ');
    const result = await this.prismaService.feed.findMany({
      where: {
        group_id: user.group_id,
        OR: [
          {
            title: {
              contains: word,
            },
          },
          {
            highlight: {
              some: {
                contents: {
                  contains: word,
                },
                type: {
                  not: 2,
                },
              },
            },
          },
        ],
      },
      include: {
        bookmark: true,
        highlight: true,
        user: true,
      },
    });
    const real_result = [];
    for (let i = 0; i < result.length; i++) {
      const resultinfo = [];

      for (let j = 0; j < result[i].highlight.length; j++) {
        if (result[i].highlight[j].type == 1) {
          const includeIdx = result[i].highlight[j].contents
            .toUpperCase()
            .indexOf(word.toUpperCase());
          if (includeIdx != -1) {
            resultinfo.push({
              type: 1,
              includeStart: includeIdx,
              includeEnd: includeIdx + word.length,
              highlight: result[i].highlight[j],
            });
          }
        }
      }

      real_result.push({
        createdAt: result[i].createdAt,
        title: result[i].title,
        group_id: result[i].group_id,
        id: result[i].id,
        updatedAt: result[i].updatedAt,
        url: result[i].url,
        user: result[i].user,
        bookmark: result[i].bookmark,
        resultinfo: resultinfo,
      });
    }
    return real_result;
  }
}
