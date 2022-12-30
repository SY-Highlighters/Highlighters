import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Feed } from '@prisma/client';

@Injectable()
export class FeedService {
  constructor(private prismaService: PrismaService) {}

  // 전체조회
  async fetchAllFeeds(): Promise<Feed[]> {
    return this.prismaService.feed.findMany();
  }

  // 단일조회
  async fetchFeedById(id: number): Promise<Feed | null> {
    return this.prismaService.feed.findUnique({ where: { id: Number(id) } });
  }

  // 삭제
  async deleteFeedById(id: number): Promise<Feed | null> {
    return this.prismaService.feed.delete({ where: { id: Number(id) } });
  }

  // 생성
  async addFeed(data: Feed): Promise<Feed> {
    return this.prismaService.feed.create({ data });
  }
}
