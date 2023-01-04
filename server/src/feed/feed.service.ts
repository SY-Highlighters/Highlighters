import { Feed, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { getUrlMeta } from 'src/util/geturlmeta';
import { CreateFeedDto } from './dto/feed.dto';
import { HighlightService } from 'src/highlight/highlight.service';
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';

@Injectable()
export class FeedService {
  constructor(
    private readonly prismaService: PrismaService,

    @Inject(forwardRef(() => HighlightService))
    private readonly highlightService: HighlightService,
  ) {}

  async createFeed(createFeedDto: CreateFeedDto): Promise<Feed> {
    const { user_email, group_id, url } = createFeedDto;
    const result = await this.prismaService.feed.create({
      data: { user_email, group_id, url },
    });

    return result;
  }

  async findFeedById(id: number): Promise<Feed> {
    return await this.prismaService.feed.findUnique({
      where: { id },
    });
  }

  async findFeedByURL(url: string): Promise<Feed> {
    const result = await this.prismaService.feed.findFirst({
      where: { url: url },
    });

    return result;
  }

  async findFeedByGroupId(id: number): Promise<Feed[]> {
    const feeds = await this.prismaService.feed.findMany({
      where: { group_id: id },
      orderBy: { updatedAt: 'desc' },
    });

    return feeds;
  }

  async findGroupFeedWithOg(id: number): Promise<object[]> {
    const feeds = await this.findFeedByGroupId(id);

    const feedswithOg: object[] = [];
    for (const feed of feeds) {
      const highlights = await this.highlightService.findAllHighlightById(
        feed.id,
      );

      if (feed.url) {
        const meta = await getUrlMeta(feed.url);
        // 존재하지 않는다면 임의의 값 넣기
        if(meta.title === undefined) {
          meta.title = "No Title"
        }
        if(meta.desc === undefined) {
          meta.desc = "No Description"
        }
        if(meta.image === undefined) {
          meta.image = "https://i.imgur.com/1Q9ZQ9q.png"
        }
        const feedwithOg = {
          ...feed,
          highlight: highlights,
          og_title: meta.title,
          og_desc: meta.desc,
          og_image: meta.image,
        };
        feedswithOg.push(feedwithOg);
      }
    }

    return feedswithOg;
  }

  // 그룹 내 모든 유저들의 프로필(닉네임, 사진) 찾기
  async findUsersProfileByGroupId(id: number): Promise<object[]> {
    const users = await this.prismaService.user.findMany({
      where: { group_id: id },
    });

    const usersprofileinfo: object[] = [];
    for (const user of users) {
      const user_profile = await this.prismaService.user.findUnique(
        { where: { email: user.email } },
      )

      if (user_profile) {
        // user의 image 혹은 nickname이 없다면 임의의 값 넣기
        if (user_profile.image == null) {
          user_profile.image = "https://i.imgur.com/1Q9ZQ9q.png"
        }
        if (user_profile.nickname == null) {
          user_profile.nickname = "No Nickname"
        }
        const userprofileinfo = {
          profile_image: user_profile.image,
          profile_nickname: user_profile.nickname,
        };
        usersprofileinfo.push(userprofileinfo);
      }
    }
    return usersprofileinfo;
  }

  // 나 자신의 프로필 찾기
  async findMyProfile(email: string): Promise<object> {
    const user = await this.prismaService.user.findUnique(
      { where: { email: email } },
    )

    let myprofileinfo: object;
    if (user) {
      // user의 image 혹은 nickname이 없다면 임의의 값 넣기
      if (user.image == null) {
        user.image = "https://i.imgur.com/1Q9ZQ9q.png"
      }
      if (user.nickname == null) {
        user.nickname = "No Nickname"
      }
      const myprofileinfo_ = {
        profile_image: user.image,
        profile_nickname: user.nickname,
      };
      myprofileinfo = myprofileinfo_;
    }
    return myprofileinfo;
  }

  async deleteFeedById(id: number): Promise<Feed> {
    const result = await this.prismaService.feed.delete({
      where: { id },
    });

    return result;
  }
}
