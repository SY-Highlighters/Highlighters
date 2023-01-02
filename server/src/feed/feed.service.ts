import { Prisma, Feed, TestFeed } from '.prisma/client';
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

  async testjson(body: Prisma.JsonValue): Promise<null> {
    console.log(body);
    return null;
  }

  // 아이디에 따른 피드 조회
  // async fetchFeedByGroupId(id: number): Promise<Feed | null> {
  //   const result = await this.prismaService
  //     .$queryRaw`SELECT * FROM feed WHERE group_id = ${id}`;
  //   // return this.prismaService.feed.findUnique({
  //   //   where: { feed_id: Number(id) },
  //   // });
  // }

  // 삭제
  async deleteFeedById(id: number): Promise<Feed | null> {
    return this.prismaService.feed.delete({ where: { feed_id: Number(id) } });
  }
}
