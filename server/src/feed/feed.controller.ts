import { GetUser } from './../auth/get-user.decorator';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import {
  Controller,
  Get,
  Post,
  Delete,
  CacheInterceptor,
} from '@nestjs/common';
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
import { elasticFeedDto } from 'src/repository/dto/elastic.dto';

@Controller('api/feed')
// @UseInterceptors(CacheInterceptor) // get요청만 cache 할 수 있음
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
    @Body('url') url: string,
    @GetUser() user: User,
  ): Promise<boolean> {
    return this.feedService.findFeedByUrl(url, user);
  }

  // 새로운 Feed 생성
  @Post('/create')
  async createFeed(
    @Body() createFeedDto: CreateFeedDto,
    @GetUser() user: User,
  ): Promise<Feed> {
    return this.feedService.createFeed(createFeedDto, user);
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
  async findFeedByGroupId(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<object[]> {
    // console.log()
    return this.feedService.findFeedByGroupId(id, user);
  }

  @ApiResponse({ status: 200, description: 'success', type: [Object] })
  @ApiOperation({ summary: '로그인한 사용자가 작성한 피드 찾기' })
  @Get('/user')
  async findFeedByUserId(@GetUser() user: User): Promise<Feed[]> {
    return this.feedService.findFeedByUserId(user);
  }

  // Id로 Feed 찾은 후 삭제
  @Delete('/delete/:id')
  async deleteFeedById(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<Feed> {
    return this.feedService.deleteFeedById(id, user);
  }

  // Feed test 생성
  @Post('/ela')
  async inputFeed(elasticfeed: elasticFeedDto) {
    return this.feedService.inputFeed(elasticfeed);
  }
}
