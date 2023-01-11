import { ElasticsearchService } from './../repository/connection';
import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async find(word: string, user: User): Promise<object[] | void> {
    const client = this.elasticsearchService.getClient();
    const paper = await client.search({
      index: 'search-mysql',
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
    console.log(paper.hits.hits);
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
      }

      return result;
    }
  }
}
