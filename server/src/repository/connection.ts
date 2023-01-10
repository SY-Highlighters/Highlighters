import * as elasticsearch from '@elastic/elasticsearch';
import { Injectable } from '@nestjs/common';

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
}
