import { Feed } from '@prisma/client';
import { FeedRequestDto } from './dto/feed.request';
import { TestFeed } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { TestFeedRequestDto } from './dto/testfeed.request';

@Injectable()
export class FeedService {
  constructor(private readonly prismaService: PrismaService) {}

  // 테스트 피드 조회
  async testfetchAllFeeds(body: TestFeedRequestDto): Promise<TestFeed[]> {
    const feeds = await this.prismaService.testFeed.findMany({
      where: { group: body.group },
    });
    return feeds;
  }

  async testjson(body): Promise<null> {
    console.log(body);
    return null;
  }

  // 아이디에 따른 피드 조회
  async fetchFeedByGroupId(body: FeedRequestDto): Promise<Feed | null> {
    const group_id = body.group_id;
    return await this.prismaService
      .$queryRaw`SELECT * FROM FEED WHERE group_id = ${group_id}`;
  }

  // 삭제
  async deleteFeedById(id: number): Promise<Feed | null> {
    return this.prismaService.feed.delete({ where: { feed_id: Number(id) } });
  }
}
