import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';

@Module({
  providers: [EventGateway],
  exports: [EventGateway],
})
export class EventModule {}
