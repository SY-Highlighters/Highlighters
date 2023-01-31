import { Module, CacheModule } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { FeedService } from 'src/feed/feed.service';
import { ElasticsearchService } from 'src/repository/connection';
import { TagService } from 'src/tag/tag.service';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    AuthModule,
    CacheModule.register({
      store: redisStore,
      url: process.env.REDIS_URL,
    }),
  ],
  controllers: [BookmarkController],
  providers: [BookmarkService, FeedService, TagService, ElasticsearchService],
})
export class BookmarkModule {}
