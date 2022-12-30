import { PrismaService } from './../prisma.service';
import { Module } from '@nestjs/common';
import { FeedController } from './controller/feed.controller';
import { FeedService } from './service/feed.service';

@Module({
  controllers: [FeedController],
  providers: [FeedService, PrismaService],
})
export class FeedModule {}
