import { Feed, TestFeed } from './../../../node_modules/.prisma/client/index.d';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TestFeedRequestDto } from '../dto/testfeed.request';

@Injectable()
export class FeedService {
  constructor(private readonly prismaService: PrismaService) {}

  // 전체조회
  async fetchAllFeeds(body: TestFeedRequestDto): Promise<TestFeed[]> {
    const feeds = await this.prismaService.testFeed.findMany({
      where: { group: body.group },
    });
    return feeds;
  }

  // 삭제
  async deleteFeedById(id: number): Promise<Feed | null> {
    return this.prismaService.feed.delete({ where: { id: Number(id) } });
  }
}
