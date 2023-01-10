import { Param } from '@nestjs/common/decorators';
import {
  Body,
  Get,
  Controller,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptors';
import { RequestTagCreateDto, RequestTagDeleteDto } from './dto/tag.dto';
import { TagService } from './tag.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/api/tag')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class TagController {
  constructor(private readonly tagService: TagService) {}

  // 태그 생성
  @ApiResponse({ status: 200, description: 'success', type: null })
  @ApiOperation({ summary: '태그 생성' })
  @Post('/create')
  async createTag(
    @Body() requestTagCreateDto: RequestTagCreateDto,
    @GetUser() user: User,
  ): Promise<null> {
    return this.tagService.createTag(requestTagCreateDto, user);
  }

  // 태그 삭제
  @ApiResponse({ status: 200, description: 'success', type: null })
  @ApiOperation({ summary: '태그 삭제' })
  @Delete('/delete')
  async deleteTag(
    @Body() requestTagDeleteDto: RequestTagDeleteDto,
    @GetUser() user: User,
  ): Promise<null> {
    return this.tagService.deleteTag(requestTagDeleteDto, user);
  }

  // 웹에서 그룹 내 모든 태그 조회
  @Get('/web')
  async findTagWeb(@GetUser() user: User): Promise<string[]> {
    return this.tagService.getTag(user);
  }

  // 태그 검색
  @Get('/search/:tag')
  async searchTag(
    @GetUser() user: User,
    @Param('tag') tag: string,
  ): Promise<object[]> {
    return this.tagService.searchTag(tag, user);
  }

  // 피드에서 해당하는 태그 조회
  @Get('/feed/:id')
  async getTagByFeedId(@Param('id') id: number): Promise<string[]> {
    return this.tagService.getTagByFeedId(id);
  }
}
