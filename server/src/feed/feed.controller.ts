import { GetUser } from './../auth/get-user.decorator';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { Controller, Get, Post, Delete } from '@nestjs/common';
import { Feed, User } from '@prisma/client';
import {
  Body,
  Param,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { CreateFeedDto } from './dto/feed.dto';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptors';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';

@Controller('api/feed')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  // URL로 Feed 찾기
  @ApiResponse({ status: 200, description: 'success', type: 'Feed' })
  @ApiOperation({ summary: 'URL로 Feed 찾기' })
  @Post('/feed_url')
  async findFeedByUrl(
    @Body() feed_url: JSON,
    @GetUser() user: User,
  ): Promise<Feed | null> {
    return this.feedService.findFeedByUrl(feed_url, user);
  }

  // 새로운 Feed 생성
  @Post('/create')
  async createFeed(
    @Body() createFeedDto: CreateFeedDto,
    @GetUser() user: User,
  ): Promise<Feed> {
    createFeedDto.user_email = user.email;
    createFeedDto.group_id = user.group_id;

    return this.feedService.createFeed(createFeedDto);
  }

  // Feed take 개의 page Feed 반환
  @ApiResponse({ status: 200, description: 'success', type: 'Feed' })
  @ApiOperation({ summary: 'Feed take 개의 page Feed 반환' })
  @Get('/sep/feed')
  async findSepFeedById(
    @Query('page') page: number,
    @Query('take') take: number,
    @GetUser() user: User,
  ) {
    return this.feedService.findSepFeedById(Number(page), Number(take), user);
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

  // Id로 Feed 찾은 후 삭제
  @Delete('/delete/:id')
  async deleteFeedById(@Param('id') id: number): Promise<Feed> {
    return this.feedService.deleteFeedById(id);
  }
}
