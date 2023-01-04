import { PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHighlightDto {
  @IsString()
  @IsOptional()
  user_email: string;

  @IsNumber()
  @IsOptional()
  group_id: number;

  @IsString()
  url: string;

  @IsString()
  contents: string;

  @IsNotEmpty()
  selection: Prisma.JsonArray;
}

export class UpdateHighlightDto extends PartialType(CreateHighlightDto) {}
