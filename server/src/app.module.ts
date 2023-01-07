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

@Module({
  imports: [
    FeedModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    HighlightModule,
    AuthModule,
    MemberModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
