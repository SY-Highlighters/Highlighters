import { Highlight } from '@prisma/client';
import * as elasticsearch from '@elastic/elasticsearch';
import { Global, Injectable } from '@nestjs/common';

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

  async inputFeed() {
    await this.client.index({
      index: 'search-highlighter',
      document: {
        title: `[웹소켓] WebSocket의 개념 및 사용이유, 작동원리, 문제점`,
        url: 'https://www.naver.com',
      },
    });
  }
}
