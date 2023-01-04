import { FeedService } from './feed.service';
import { Controller, Get, Post, Delete } from '@nestjs/common';
import { Feed, User } from '@prisma/client';
import { Body, Param, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { CreateFeedDto } from './dto/feed.dto';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('api/feed')
@UseGuards(AuthGuard())
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  // 새로운 Feed 생성
  @Post('/')
  async createFeed(
    @Body() createFeedDto: CreateFeedDto,
    @GetUser() user: User,
  ): Promise<Feed> {
    createFeedDto.user_email = user.email;
    createFeedDto.group_id = user.group_id;

    return this.feedService.createFeed(createFeedDto);
  }

  // Id로 Feed 찾기
  @Get('/id/:id')
  async findFeedById(@Param('id') id: number): Promise<Feed> {
    return this.feedService.findFeedById(id);
  }

  // group_id로 찾은 group에 있는 모든 feed 찾기
  @Get('/group/:id')
  async findFeedByGroupId(@Param('id') id: number): Promise<object[]> {
    // console.log()
    return this.feedService.findGroupFeedWithOg(id);
  }

  // group_id로 찾은 group에 있는 모든 user의 프로필 찾기
  @Get('/findusers/group/:id')
  async findUsersProfileByGroupId(@Param('id') id: number): Promise<object[]> {
    return this.feedService.findUsersProfileByGroupId(id);
  }

  // 나 자신의 프로필 찾기
  @Get('/findusers/me')
  async findMyProfile(@GetUser() user: User): Promise<object> {
    return this.feedService.findMyProfile(user.email);
  }

  // Id로 Feed 찾은 후 삭제
  @Delete('/delete/:id')
  async deleteFeedById(@Param('id') id: number): Promise<Feed> {
    return this.feedService.deleteFeedById(id);
  }
}
