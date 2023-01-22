import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';
import { CalendarDto } from './dto/calendar.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class CalendarService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async showCalendar(user: User, page: number, take: number, date: Date) {
    const curr_date = new Date();
    // console.log('current date: ', curr_date.getDate());
    // console.log('request date: ', date.getDate());

    let cache_flag = 0;
    // 요청 날짜가 현재 날짜와 같지 않은 경우만 캐시
    if (date.getDate() !== curr_date.getDate()) {
      const cache_result = await this.cacheManager.get(
        `calendar-${user.group_id}-${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}-${page}`,
      );
      if (!cache_result) {
        console.log('[calendar] cache miss');
        cache_flag = 1;
      } else {
        console.log('[calendar] cache hit');
        return cache_result;
      }
    }

    try {
      const count = await this.prismaService.feed.count({
        where: {
          group_id: user.group_id,
          updatedAt: {
            gte: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              date.getHours(),
            ),
            lte: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() + 1,
              date.getHours(),
            ),
          },
        },
      });
      console.log('calender count: ', count);
      const feeds = await this.prismaService.feed.findMany({
        where: {
          group_id: user.group_id,
          updatedAt: {
            gte: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              date.getHours(),
            ),
            lte: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() + 1,
              date.getHours(),
            ),
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

      const result = {
        totalcount: count,
        currentPage: page,
        totalPage: Math.ceil(count / take),
        feeds,
      };
      console.log('date: ', date, date.getMonth());
      if (cache_flag === 1) {
        await this.cacheManager.set(
          `calendar-${user.group_id}-${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}-${page}`,
          result,
          60 * 60 * 24, // ttl: 24시간
        );
        console.log('[calendar] cache set');
      }
      return result;
    } catch (e) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async showCalendarMonth(user: User, date: Date) {
    const target_date = new Date(date.getFullYear(), date.getMonth());
    const limit_date = new Date(date.getFullYear(), date.getMonth() + 1);
    const result = [];
    for (let i = 0; i < 31; i++) {
      const curr_date = new Date(
        target_date.getFullYear(),
        target_date.getMonth(),
      );
      curr_date.setDate(i + 1);

      if (curr_date > limit_date) {
        break;
      }

      const count = await this.prismaService.feed.findFirst({
        where: {
          group_id: user.group_id,
          createdAt: {
            gte: new Date(
              curr_date.getFullYear(),
              curr_date.getMonth(),
              curr_date.getDate(),
              curr_date.getHours(),
            ),
            lte: new Date(
              curr_date.getFullYear(),
              curr_date.getMonth(),
              curr_date.getDate() + 1,
              curr_date.getHours(),
            ),
          },
        },
      });

      if (count) {
        result.push({
          startDatetime: curr_date,
        });
      }
    }
    return result;
  }
}
