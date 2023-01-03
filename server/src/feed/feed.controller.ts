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

  @Post('/')
  async createFeed(@Body() createFeedDto: CreateFeedDto): Promise<Feed> {
    return this.feedService.createFeed(createFeedDto);
  }

  @Get('/id/:id')
  async findFeedById(@Param('id') id: number): Promise<Feed> {
    return this.feedService.findFeedById(id);
  }

  @Get('/group/:id')
  async findFeedByGroupId(@Param('id') id: number): Promise<object[]> {
    return this.feedService.findGroupFeedWithOg(id);
  }

  @Delete('/:id')
  async deleteFeedById(@Param('id') id: number): Promise<Feed> {
    return this.feedService.deleteFeedById(id);
  }

  // @Get('/getusertest/')
  // getuser(@GetUser() user: User): Promise<User> { // 
  //   console.log('getuser 들어왔다')
  //   console.log('user', user.email, user.group_id)
  //   return 
  // }
}
