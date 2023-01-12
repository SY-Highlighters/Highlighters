import { Highcomment } from './../../node_modules/.prisma/client/index.d';
import { Highlight, User } from '@prisma/client';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HighcommentService } from './highcomment.service';
import { Controller } from '@nestjs/common';
import { UseFilters } from '@nestjs/common/decorators/core/exception-filters.decorator';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptors';
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { GetUser } from 'src/auth/get-user.decorator';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { RequesthighcommentDto } from './dto/highcomment.dto';

@Controller('api/highcomment')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class HighcommentController {
  constructor(private readonly highcommentService: HighcommentService) {}

  // 하이라이트 코멘트 생성
  @ApiResponse({ status: 200, description: 'success', type: 'Highcomment' })
  @ApiOperation({ summary: '하이라이트 코멘트 생성' })
  @Post('/create')
  async createHighlightComment(
    @GetUser() user: User,
    @Body() requesthighcommentdto: RequesthighcommentDto,
  ): Promise<Highcomment> {
    return this.highcommentService.createHighlightComment(
      user,
      requesthighcommentdto,
    );
  }

  // 하이라이트 코멘트 조회
}
