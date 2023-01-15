import {
  UseInterceptors,
  UseFilters,
  Param,
  Query,
} from '@nestjs/common/decorators';
import { Controller, UseGuards, Post, Body, Delete, Get } from '@nestjs/common';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptors';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '@prisma/client';
import { RequestBookmarkDto } from './dto/bookmark.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/bookmark')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  // 북마크 생성
  @ApiResponse({ status: 200, description: 'success', type: null })
  @ApiOperation({ summary: '북마크 생성' })
  @Post('/create')
  async createBookmark(
    @Body() requestBookmarkDto: RequestBookmarkDto,
    @GetUser() user: User,
  ): Promise<null> {
    return this.bookmarkService.createBookmark(requestBookmarkDto, user);
  }

  // 북마크 삭제
  @ApiResponse({ status: 200, description: 'success', type: null })
  @ApiOperation({ summary: '북마크 삭제' })
  @Delete('/delete/:id')
  async deleteBookmark(@Param('id') id: number): Promise<null> {
    return this.bookmarkService.deleteBookmark(id);
  }

  // 북마크 조회
  @ApiResponse({
    status: 200,
    description: 'success',
    type: 'Feed',
  })
  @ApiOperation({ summary: '북마크 조회' })
  @Get('/')
  async findBookmark(
    @Query('page') page: number,
    @Query('take') take: number,
    @GetUser() user: User,
  ) {
    return this.bookmarkService.getBookmark(Number(page), Number(take), user);
  }
}
