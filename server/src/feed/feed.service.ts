import { Feed } from '@prisma/client';
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
    const { user_email, group_id, url, title } = createFeedDto;
    const result = await this.prismaService.feed.create({
      data: {
        user_email,
        group_id,
        url,
        title,
      },
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
      include: {
        highlight: true,
        tag: true,
      },
    });

    return feeds;
  }

  async findGroupFeedWithOg(id: number): Promise<object[]> {
    const feeds = await this.findFeedByGroupId(id);

    const feedswithOg: object[] = [];
    for (const feed of feeds) {
      if (feed.url) {
        try {
          const meta = await getUrlMeta(feed.url);
          const feedwithOg = {
            ...feed,
            og_title: meta.title,
            og_desc: meta.desc,
            og_image: meta.image,
          };
          feedswithOg.push(feedwithOg);
        } catch (e) {
          const feedwithOg = {
            ...feed,
            og_title: 'Untitled',
            og_desc: '',
            og_image:
              'https://img.favpng.com/23/20/7/computer-icons-information-png-favpng-g8DtjAPPNhyaU9EdjHQJRnV97_t.jpg',
          };
          feedswithOg.push(feedwithOg);
        }
      }
    }

    return feedswithOg;
  }

  async deleteFeedById(id: number): Promise<Feed> {
    const result = await this.prismaService.feed.delete({
      where: { id },
    });

    return result;
  }
}
