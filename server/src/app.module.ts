import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedModule } from './feed/feed.module';
import { PrismaModule } from './repository/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HighlightModule } from './highlight/highlight.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { MemberModule } from './member/member.module';
import { UserModule } from './user/user.module';
import { NotiModule } from './noti/noti.module';
import { TagModule } from './tag/tag.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ElasticsearchService } from './repository/connection';
import { CommentModule } from './comment/comment.module';
import { SearchModule } from './search/search.module';
// import { ApmModule } from 'nestjs-elastic-apm';
import { CalendarModule } from './calendar/calendar.module';
import { EventModule } from './event/event.module';
import { SummaryModule } from './summary/summary.module';

@Module({
  imports: [
    FeedModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    HighlightModule,
    AuthModule,
    MemberModule,
    UserModule,
    NotiModule,
    TagModule,
    BookmarkModule,
    CommentModule,
    SearchModule,
    // ApmModule.register(),
    CalendarModule,
    EventModule,
    SummaryModule,
  ],
  controllers: [AppController],
  providers: [AppService, ElasticsearchService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
