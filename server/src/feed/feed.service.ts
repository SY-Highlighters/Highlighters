import { Feed, TestFeed } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { TestFeedRequestDto } from './dto/testfeed.request';

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

  // 단건조회
  async fetchFeedById(id: number): Promise<Feed | null> {
    return this.prismaService.feed.findUnique({
      where: { feed_id: Number(id) },
    });
  }

  // 삭제
  async deleteFeedById(id: number): Promise<Feed | null> {
    return this.prismaService.feed.delete({ where: { feed_id: Number(id) } });
  }
}
