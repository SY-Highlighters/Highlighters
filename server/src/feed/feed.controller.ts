import { TestFeedRequestDto } from './dto/testfeed.request';
import { FeedService } from './feed.service';
import { Controller, Get, Post, Delete } from '@nestjs/common';
import { Feed, TestFeed } from '@prisma/client';
import { Body, Param } from '@nestjs/common/decorators';

@Controller('api/feeds')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('test/:id')
  async fetchAllFeeds(@Body() body: TestFeedRequestDto): Promise<TestFeed[]> {
    return this.feedService.fetchAllFeeds(body);
  }

  @Get(':id')
  async fetchFeedById(@Param('id') id: number): Promise<Feed | null> {
    return this.feedService.fetchFeedById(id);
  }

  @Delete('/:id')
  async deleteFeedById(@Param('id') id: number): Promise<Feed | null> {
    return this.feedService.deleteFeedById(id);
  }
}
