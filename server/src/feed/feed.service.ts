import {
  JsonObject,
  JsonArray,
} from './../../../client/node_modules/boxen/node_modules/type-fest/source/basic.d';
import { Feed } from '@prisma/client';
import { FeedRequestDto } from './dto/feed.request';
import { TestFeed } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { TestFeedRequestDto } from './dto/testfeed.request';
import { getUrlMeta } from 'src/utils/geturlmeta';

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
  async fetchFeedByGroupId(id: number): Promise<object[] | null> {
    // feeds 받기
    const feeds: JsonArray = await this.prismaService
      .$queryRaw`SELECT * FROM FEED WHERE group_id = ${id}`;
    const feedswithOg: object[] = [];
    console.log(typeof feeds);
    feeds.map(async (feed: JsonObject) => {
      // const getfeed: Feed = JSON.parse(feed.toString());
      // url이 있으면 메타데이터 가져오기
      if (feed.URL) {
        console.log(feed.URL);
        const meta = await getUrlMeta(feed.URL);
        const feedwithOg = {
          feed_id: feed.FEED_ID,
          group_id: feed.GROUP_ID,
          url: feed.URL,
          createdAt: feed.CREATEDAT,
          updatedAt: feed.UPADATEDAT,
          user_id: feed.USER_ID,
          og_title: meta.title,
          og_desc: meta.desc,
          og_image: meta.image,
        };
        feedswithOg.push(feedwithOg);
      }
    });
    return feedswithOg;
  }

  // 유저아이디, 그룹아이디에 따른 피드 생성
  async createFeed(body: FeedRequestDto): Promise<Feed> {
    return;
    // return await this.prismaService.feed.create({
    //   data: {
    //     group: {
    //       connect: {
    //         group_id: body.group_id,
    //       },
    //     },
    //   },
    // });
  }

  // 피드아이디에 따른 피드 삭제
  async deleteFeedByFeedId(id: number): Promise<number> {
    return await this.prismaService
      .$executeRaw`DELETE FROM FEED WHERE feed_id = ${id}`;
  }
}
