import { ElasticsearchService } from './../repository/connection';
import { User, Highlight } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly prismaService: PrismaService,
  ) {}

  async find(word: string, user: User): Promise<object[] | void> {
    const client = this.elasticsearchService.getClient();
    // const take = await client.get({
    //   index: 'search-mysql',
    //   id: '1',
    // });
    console.log(word);

    const paper = await client.search({
      index: 'search-highlighter',
      // body: {
      //   query: {
      //     query_string: {
      //       query: word,
      //     },
      //   },
      // },
      query: {
        bool: {
          must_not: [
            {
              match: {
                Table: 'NOTI',
              },
            },
            {
              match: {
                Table: 'COMMENT',
              },
            },
          ],

          should: [
            {
              match: {
                tag_name: word,
              },
            },
            {
              match: {
                contents: word,
              },
            },
            {
              match: {
                nickname: word,
              },
            },
            {
              match: {
                title: word,
              },
            },
          ],
        },
      },
    });
    // console.log(paper.hits.hits);
    const result = [];
    for (let i = 0; i < paper.hits.hits.length; i++) {
      if (
        paper.hits.hits[i]._source &&
        paper.hits.hits[i]._source['Table'] == 'FEED'
      ) {
        if (user.group_id != paper.hits.hits[i]._source['group_id']) {
          continue;
        }
        const temp = {
          Table: paper.hits.hits[i]._source['Table'],
          title: paper.hits.hits[i]._source['title'],
          url: paper.hits.hits[i]._source['url'],
        };
        result.push(temp);
      } else if (
        paper.hits.hits[i]._source &&
        paper.hits.hits[i]._source['Table'] == 'HIGHLIGHT'
      ) {
        if (user.group_id != paper.hits.hits[i]._source['group_id']) {
          continue;
        }
        const temp = {
          Table: paper.hits.hits[i]._source['Table'],
          feed_id: paper.hits.hits[i]._source['feed_id'],
          contents: paper.hits.hits[i]._source['contents'],
        };
        result.push(temp);
      }

      return result;
    }
  }

  async findtest(word: string, user: User): Promise<object[] | void> {
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
            user_email: {
              contains: word,
            },
          },
          {
            highlight: {
              some: {
                contents: {
                  contains: word,
                },
              },
            },
          },
          {
            tag: {
              some: {
                tag_name: {
                  contains: word,
                },
              },
            },
          },
        ],
      },
      include: {
        bookmark: true,
        highlight: true,
        tag: true,
      },
    });
    // console.log(result[0]);
    const real_result = [];
    for (let i = 0; i < result.length; i++) {
      const resultinfo = [];
      if (result[i].title.includes(word)) {
        resultinfo.push({ title: result[i].title });
      }
      if (result[i].user_email.includes(word)) {
        resultinfo.push({ user_email: result[i].user_email });
      }
      for (let j = 0; j < result[i].highlight.length; j++) {
        if (result[i].highlight[j].contents.includes(word)) {
          resultinfo.push({ highlight: result[i].highlight[j].contents });
        }
      }
      for (let j = 0; j < result[i].tag.length; j++) {
        if (result[i].tag[j].tag_name.includes(word)) {
          resultinfo.push({ tag_name: result[i].tag[j].tag_name });
        }
      }
      real_result.push({
        createdAt: result[i].createdAt,
        title: result[i].title,
        group_id: result[i].group_id,
        id: result[i].id,
        updatedAt: result[i].updatedAt,
        url: result[i].url,
        user_email: result[i].user_email,
        bookmark: result[i].bookmark,
        resultinfo: resultinfo,
      });
    }
    return real_result;
  }
}
