import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ElasticsearchService } from 'src/repository/connection';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [AuthModule],
  controllers: [SearchController],
  providers: [SearchService, ElasticsearchService],
})
export class SearchModule {}
