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

  // 그룹아이디에 따른 피드 조회
  async fetchFeedByGroupId(id: number): Promise<Feed | null> {
    return await this.prismaService
      .$queryRaw`SELECT * FROM FEED WHERE group_id = ${id}`;
  }

  // 피드아이디에 따른 피드 삭제
  async deleteFeedByFeedId(id: number): Promise<number> {
    return await this.prismaService
      .$executeRaw`DELETE FROM FEED WHERE feed_id = ${id}`;
  }
}
