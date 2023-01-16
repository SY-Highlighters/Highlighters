import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';
import { CalendarDto } from './dto/calendar.dto';

@Injectable()
export class CalendarService {
  constructor(private readonly prismaService: PrismaService) {}

  // const date = new Date(server_date + '00:09:00');

  async showCalendar(user: User, calendarDto: CalendarDto) {
    const { date, take, page } = calendarDto;
    try {
      const count = await this.prismaService.feed.count({
        where: {
          group_id: user.group_id,
          createdAt: {
            gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          },
        },
      });
      const feeds = await this.prismaService.feed.findMany({
        where: {
          group_id: user.group_id,
          createdAt: {
            gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: take,
        skip: take * (page - 1),
        include: {
          highlight: {
            include: {
              user: {
                select: {
                  nickname: true,
                  image: true,
                },
              },
            },
            orderBy: [
              {
                user_email: 'asc',
              },
              {
                createdAt: 'asc',
              },
            ],
          },
          tag: true,
          og: true,
          user: {
            select: {
              nickname: true,
              image: true,
            },
          },
          comment: {
            orderBy: { createdAt: 'desc' },
          },
          bookmark: {
            where: {
              user_email: user.email,
            },
            select: {
              id: true,
            },
          },
        },
      });
      return {
        currentPage: page,
        totalPage: Math.ceil(count / take),
        feeds,
      };
    } catch (e) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
}