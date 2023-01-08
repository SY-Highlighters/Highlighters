import { GetUser } from 'src/auth/get-user.decorator';
import { CalendarService } from './calendar.service';
import {
  Controller,
  Get,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptors';
import { User } from '@prisma/client';

@Controller('api/calendar')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard())
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  // 캘린더 조회
  @Get('/')
  async showCalendar(
    @GetUser() user: User,
    @Body('date') date: Date,
  ): Promise<object[]> {
    return this.calendarService.showCalendar(user, date);
  }
}
