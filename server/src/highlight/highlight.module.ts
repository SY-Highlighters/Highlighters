import { Module } from '@nestjs/common';
import { HighlightController } from './highlight.controller';
import { HighlightService } from './highlight.service';

@Module({
  controllers: [HighlightController],
  providers: [HighlightService],
})
export class HighlightModule {}
