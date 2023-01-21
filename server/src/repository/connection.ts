import { Highlight } from '@prisma/client';
import * as elasticsearch from '@elastic/elasticsearch';
import { Global, Injectable } from '@nestjs/common';
import { elasticFeedDto } from './dto/elastic.dto';

@Global()
@Injectable()
export class ElasticsearchService {
  private readonly client: elasticsearch.Client;

  constructor() {
    this.client = new elasticsearch.Client({
      cloud: {
        id: process.env.ELASTICSEARCH_NODE,
      },
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
      },
    });
  }

  async inputFeed(elasticfeed: elasticFeedDto) {
    console.log('일라스틱 피드 생성');
    await this.client.index({
      index: 'search-highlighter',
      document: {
        id: elasticfeed.feed_id,
        contents: [elasticfeed.contents],
        title: elasticfeed.title,
        user_nickname: elasticfeed.user_nickname,
        description: elasticfeed.description,
        group_id: elasticfeed.group_id,
        url: elasticfeed.url,
      },
    });
  }

  async deleteFeed(feed_id: string) {
    try {
      await this.client.deleteByQuery({
        index: 'search-highlighter',
        body: {
          query: {
            match: {
              id: feed_id,
            },
          },
        },
      });
      return;
    } catch (e) {
      return;
    }
  }

  async appendFeed(feed_id: string, contents: string) {
    await this.client.updateByQuery({
      index: 'search-highlighter',
      body: {
        query: {
          match: {
            id: feed_id,
          },
        },
        script: {
          source: 'ctx._source.contents.add(params.contents)',
          lang: 'painless',
          params: {
            contents: contents,
          },
        },
      },
    });
  }

  async deleteHighlight(feed_id: string, contents: string) {
    try {
      await this.client.updateByQuery({
        index: 'search-highlighter',
        body: {
          query: {
            match: {
              id: feed_id,
            },
          },
        },
        script: {
          source:
            'ctx._source.contents.remove(ctx._source.contents.indexOf(params.contents))',
          lang: 'painless',
          params: {
            contents: contents,
          },
        },
      });
      return;
    } catch (e) {
      return;
    }
  }

  async findFeed(word: string, group_id: number) {
    const result = await this.client.search({
      index: 'search-highlighter',
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  contents: word,
                },
              },
              {
                term: {
                  group_id: group_id,
                },
              },
            ],
          },
        },
        track_scores: true,
      },
    });
    const real_result = [];
    for (let i = 0; i < result.hits.hits.length; i++) {
      real_result.push(result.hits.hits[i]._source);
      real_result[i].score = result.hits.hits[i]._score;
    }
    return real_result;
  }
}
