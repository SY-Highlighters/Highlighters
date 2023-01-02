import { Cheerio } from './../../node_modules/cheerio/lib/cheerio.d';
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
    const feeds: Feed[] = await this.prismaService
      .$queryRaw`SELECT * FROM FEED WHERE group_id = ${id}`;
    const feedswithOg: object[] = [];
    // console.log(feeds);

    // http meta data 가져오기
    for (const feed of feeds) {
      // url이 있으면 메타데이터 가져오기
      console.log(feed);
      if (feed.url) {
        console.log(feed.url);
        const meta = await this.getUrlMeta(feed.url);
        const feedwithOg = {
          feed_id: feed.id,
          group_id: feed.group_id,
          url: feed.url,
          createdAt: feed.createdAt,
          updatedAt: feed.updatedAt,
          user_id: feed.user_email,
          og_title: meta.title,
          og_desc: meta.description,
          og_image: meta.image,
        };
        feedswithOg.push(feedwithOg);
        console.log(feedswithOg);
      }
    }
    return feedswithOg;
  }

  async _getHostname(url) {
    let start = url.indexOf('://') + 3;
    let end = url.indexOf('/', start);
    return url.slice(start, end);
  }

  async _getProtocol(url) {
    let end = url.indexOf('://') + 3;
    return url.slice(0, end);
  }

  async _bodyScrap(url) {
    return ($) => {
      // 글제목
      let title = $("meta[property='og:title']").attr('content');
      if (!title) {
        title = $('head title').text();
        if (!title) {
          throw Error('This link has no title');
        }
      }
      // 글이미지
      let image = $("meta[property='og:image']").attr('content');
      if (!image) {
        image = $('img').attr('src');
        //이미지 세팅
        if (image && image.indexOf('http') === 0) {
          // http 로 시작하면 그냥 사용
        } else if (image && image[0] === '/') {
          // image 경로가 / 로 시작한다면
          //let urlObj = new URL(url);
          image =
            'this._getProtocol(url)' + 'this._getHostname(url)' + $(image);
        } else {
          image = '';
        }
      }

      // 글요약본
      let desc = $("meta[property='og:description']").attr('content');
      if (!desc) {
        desc = '';
      }
      return {
        title,
        image,
        desc,
      };
    };
  }

  async getUrlMeta(url) {
    const meta = await fetch(url)
      .then((res) => res.text())
      .then((body) => {
        const $ = Cheerio.load(body);
        return this._bodyScrap(url)($);
      })
      .catch((err) => {
        console.log(err);
        return {
          title: '',
          image: '',
          desc: '',
        };
      });
    return meta;
  }

  // feeds.map(async (feed: JsonObject) => {
  //   // const getfeed: Feed = JSON.parse(feed.toString());
  //   // url이 있으면 메타데이터 가져오기
  //   if (feed.URL) {
  //     console.log(feed.URL);
  //     const meta = await getUrlMeta(feed.URL);
  //     const feedwithOg = {
  //       feed_id: feed.FEED_ID,
  //       group_id: feed.GROUP_ID,
  //       url: feed.URL,
  //       createdAt: feed.CREATEDAT,
  //       updatedAt: feed.UPADATEDAT,
  //       user_id: feed.USER_ID,
  //       og_title: meta.title,
  //       og_desc: meta.desc,
  //       og_image: meta.image,
  //     };
  //     feedswithOg.push(feedwithOg);
  //   }
  // });

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
