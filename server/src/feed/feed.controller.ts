import { TestFeedRequestDto } from './dto/testfeed.request';
import { FeedService } from './feed.service';
import { Controller, Get, Post, Delete } from '@nestjs/common';
import { Feed, TestFeed, User } from '@prisma/client';
import { Body, Param, UseGuards } from '@nestjs/common/decorators';
import { FeedRequestDto } from './dto/feed.request';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('api/feeds')
@UseGuards(AuthGuard())
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('test/:id')
  async testfetchAllFeeds(
    @Body() body: TestFeedRequestDto,
  ): Promise<TestFeed[]> {
    return this.feedService.testfetchAllFeeds(body);
  }

  @Post('test/json')
  async testjson(@Body() body): Promise<void> {
    this.feedService.testjson(body);
  }

  // 그룹아이디에 따른 피드 조회
  @Get('/:id')
  async fetchFeedByGroupId(@Param('id') id: number): Promise<object[] | null> {
    return this.feedService.fetchFeedByGroupId(id);
  }

  // 유저아이디, 그룹아이디에 따른 피드 생성
  @Post('/:groupid')
  async createFeed(@Body() body: FeedRequestDto): Promise<Feed> {
    return this.feedService.createFeed(body);
  }

  // 피드아이디에 따른 피드 삭제
  @Delete('delete/:id')
  async deleteFeedById(@Param('id') id: number): Promise<number> {
    return this.feedService.deleteFeedByFeedId(id);
  }

  @Get('test')
  test(@GetUser() user: User) {
    console.log('user', user)
  }
}
