import { GetUser } from 'src/auth/get-user.decorator';
import { CalendarService } from './calendar.service';
import {
  Controller,
  Get,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Body,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptors';
import { User } from '@prisma/client';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CalendarDto } from './dto/calendar.dto';
import { query } from 'express';

@Controller('api/calendar')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  // 캘린더 조회
  @ApiResponse({ status: 200, description: 'success', type: 'Feed' })
  @ApiOperation({ summary: '캘린더 조회' })
  @Get('/')
  async showCalendar(
    @GetUser() user: User,
    @Query('page') page: number,
    @Query('take') take: number,
    @Query('date') date: Date,
  ) {
    return this.calendarService.showCalendar(user, page, take, date);
  }

  // 캘린더 월별 유무 조회
  @ApiResponse({ status: 200, description: 'success', type: '일별 피드 숫자' })
  @ApiOperation({ summary: '캘린더 월별 유무 조회' })
  @Get('/month')
  async showCalendarMonth(@GetUser() user: User, @Query('date') date: Date) {
    return this.calendarService.showCalendarMonth(user, date);
  }
}
