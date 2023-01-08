import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async showCalendar(user: User, date: Date): Promise<object[]> {
    const calendar = await this.prisma.feed.findMany({
      where: {
        group_id: user.group_id,
        createdAt: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        highlight: true,
        tag: true,
      },
    });

    return calendar;
  }
}
