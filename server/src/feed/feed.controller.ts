import { FeedService } from './feed.service';
import { Controller, Get, Post, Delete } from '@nestjs/common';
import { Feed } from '@prisma/client';
import { Body, Param, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { CreateFeedDto } from './dto/feed.dto';

@Controller('api/feed')
// @UseGuards(AuthGuard())
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

<<<<<<< HEAD
  @Get('test')
  test(@GetUser() user: User) {
    console.log('user', user);
  }

  @Get('test/:id')
  async testfetchAllFeeds(
    @Body() body: TestFeedRequestDto,
  ): Promise<TestFeed[]> {
    return this.feedService.testfetchAllFeeds(body);
=======
  @Post('/')
  async createFeed(@Body() createFeedDto: CreateFeedDto): Promise<Feed> {
    return this.feedService.createFeed(createFeedDto);
>>>>>>> 26550f0 (feat : highlighter->contents, feed CRUD)
  }

  @Get('/:id')
  async findFeedById(@Param('id') id: number): Promise<Feed> {
    return this.feedService.findFeedById(id);
  }

  @Get('/group/:id')
  async findFeedByGroupId(@Param('id') id: number): Promise<object[]> {
    return this.feedService.findGroupFeedWithOg(id);
  }

<<<<<<< HEAD
  // 피드아이디에 따른 피드 삭제
  @Delete('delete/:id')
  async deleteFeedById(@Param('id') id: number): Promise<number> {
    return this.feedService.deleteFeedByFeedId(id);
=======
  @Delete('/:id')
  async deleteFeedById(@Param('id') id: number): Promise<Feed> {
    return this.feedService.deleteFeedById(id);
>>>>>>> 26550f0 (feat : highlighter->contents, feed CRUD)
  }
}
