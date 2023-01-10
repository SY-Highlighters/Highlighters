import { User } from '@prisma/client';
import { ElasticsearchService } from './repository/connection';
import { Controller, Get } from '@nestjs/common';
import {
  Param,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { AppService } from './app.service';
import { SuccessInterceptor } from './common/interceptors/success.interceptors';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './auth/get-user.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }

  @UseInterceptors(SuccessInterceptor)
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthGuard())
  @Get('api/search/:word')
  async find(
    @Param('word') word: string,
    @GetUser() user: User,
  ): Promise<object[] | void> {
    const client = this.elasticsearchService.getClient();
    const paper = await client.search({
      index: 'search-mysql',
      // body: {
      //   query: {
      //     query_string: {
      //       query: word,
      //     },
      //   },
      // },\
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
            {
              match: {
                url: word,
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
