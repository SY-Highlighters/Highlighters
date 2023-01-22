import { CacheModule, Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { AuthModule } from 'src/auth/auth.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    AuthModule,
    CacheModule.register({
      store: redisStore,
      // ttl: 10,
      url: process.env.REDIS_URL,
    }),
  ],
  providers: [CalendarService],
  controllers: [CalendarController],
})
export class CalendarModule {}
