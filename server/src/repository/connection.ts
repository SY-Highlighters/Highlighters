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

  getClient() {
    return this.client;
  }

  async inputFeed(elasticfeed: elasticFeedDto) {
    await this.client.index({
      index: 'search-highlighter',
      document: {
        feed_id: elasticfeed.feed_id,
        user_nickname: elasticfeed.user_nickname,
        group_id: elasticfeed.group_id,
        title: elasticfeed.title,
        url: elasticfeed.url,
        contents: elasticfeed.contents,
      },
    });
  }
}
