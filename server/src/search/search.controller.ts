import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUser } from './../auth/get-user.decorator';
import {
  Controller,
  Get,
  UseGuards,
  Param,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptors';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';

@Controller('api/search')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // 검색바 조회
  @ApiResponse({
    status: 200,
    description: 'success',
    type: '피드, 하이라이트, 태그',
  })
  @ApiOperation({ summary: '검색바 조회' })
  @Get('bar/:word')
  async findtest(
    @GetUser() user: User,
    @Param('word') word: string,
  ): Promise<object[] | void> {
    return this.searchService.findtest(word, user);
  }

  // // 일라스틱 검색바 조회
  // @ApiResponse({
  //   status: 200,
  //   description: 'success',
  //   type: '피드, 하이라이트, 태그',
  // })
  // @ApiOperation({ summary: '일라스틱 검색바 조회' })
  // @Get('ela/:word')
  // async find(
  //   @GetUser() user: User,
  //   @Param('word') word: string,
  // ): Promise<object[] | void> {
  //   return this.searchService.find(word, user);
  // }
}
