import { GetUser } from 'src/auth/get-user.decorator';
import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptors';
import { User } from '@prisma/client';
import { SummaryService } from './summary.service';

@Controller('api/summary')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  // summary 실행
  @ApiResponse({
    status: 200,
    description: 'success',
    type: 'Summary',
  })
  @ApiOperation({ summary: 'summary 실행' })
  @Post('/')
  async summary_url(@GetUser() user: User, @Body('url') url: string) {
    return this.summaryService.summary_url(url, user);
  }
}
