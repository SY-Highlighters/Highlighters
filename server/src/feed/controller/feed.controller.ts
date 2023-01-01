import { TestFeedRequestDto } from './../dto/testfeed.request';
import { FeedService } from './../service/feed.service';
import { Controller, Get, Post, Delete } from '@nestjs/common';
import { Feed, TestFeed } from '@prisma/client';
import { Body, Param } from '@nestjs/common/decorators';

@Controller('api/feeds')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('/:id')
  async fetchAllFeeds(@Body() body: TestFeedRequestDto): Promise<TestFeed[]> {
    return this.feedService.fetchAllFeeds(body);
  }

  @Delete('/:id')
  async deleteFeedById(@Param('id') id: number): Promise<Feed | null> {
    return this.feedService.deleteFeedById(id);
  }
}
