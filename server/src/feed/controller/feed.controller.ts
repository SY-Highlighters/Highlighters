import { FeedService } from './../service/feed.service';
import { Controller, Get, Post, Delete } from '@nestjs/common';
import { Feed } from '@prisma/client';
import { Body, Param } from '@nestjs/common/decorators';

@Controller('api/feeds')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('/')
  async fetchAllFeeds(): Promise<Feed[]> {
    return this.feedService.fetchAllFeeds();
  }

  @Get('/:id')
  async fetchFeedById(@Param('id') id: number): Promise<Feed | null> {
    return this.feedService.fetchFeedById(id);
  }

  @Delete('/:id')
  async deleteFeedById(@Param('id') id: number): Promise<Feed | null> {
    return this.feedService.deleteFeedById(id);
  }

  @Post('/')
  async addFeed(@Body() data: Feed): Promise<Feed> {
    return this.feedService.addFeed(data);
  }
}
