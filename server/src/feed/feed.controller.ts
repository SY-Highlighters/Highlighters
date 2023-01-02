import { TestFeedRequestDto } from './dto/testfeed.request';
import { FeedService } from './feed.service';
import { Controller, Get, Post, Delete } from '@nestjs/common';
import { Feed, TestFeed } from '@prisma/client';
import { Body, Param } from '@nestjs/common/decorators';

@Controller('api/feeds')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('test/:id')
  async testfetchAllFeeds(
    @Body() body: TestFeedRequestDto,
  ): Promise<TestFeed[]> {
    return this.feedService.testfetchAllFeeds(body);
  }

  @Get('test/json')
  async testjson(@Body() body): Promise<void> {
    this.feedService.testjson(body);
  }

  // @Get('')
  // async fetchFeedByGroupId(@Body() body: number): Promise<Feed | null> {
  //   return this.feedService.fetchFeedByGroupId(body);
  // }

  @Delete('/:id')
  async deleteFeedById(@Param('id') id: number): Promise<Feed | null> {
    return this.feedService.deleteFeedById(id);
  }
}
