import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { highlight } from '@prisma/client';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { UpdateHighlightDto } from './dto/update-highlight.dto';
import { HighlightService } from './highlight.service';

@Controller('api/highlight')
export class HighlightController {
  constructor(private readonly highlightService: HighlightService) {}

  // Create
  @Post('/')
  async createHighlight(
    @Body() createHighlightDto: CreateHighlightDto,
  ): Promise<highlight> {
    return this.highlightService.createHighlight(createHighlightDto);
  }

  // Read One by ID
  @Get('/:id')
  async findHighlight(@Param('id') id: number): Promise<highlight> {
    return this.highlightService.findHighlight(id);
  }

  // Read Many by Feed_ID
  @Get('/feed/:id')
  async findHighlightAll(@Param('id') feed_id: number): Promise<highlight[]> {
    return this.highlightService.findAllHighlightInFeed(feed_id);
  }

  // Update
  @Patch('/:id')
  async updateHighlight(
    @Param('id') id: number,
    @Body() updateHighlightDto: UpdateHighlightDto,
  ): Promise<highlight> {
    return this.highlightService.updateHighlight(id, updateHighlightDto);
  }

  // Delete by ID
  @Delete('/:id')
  async deleteHighlight(@Param('id') id: number): Promise<highlight> {
    return this.highlightService.deleteHighlight(id);
  }
}
