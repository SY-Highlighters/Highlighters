import { PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsJSON, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateHighlightDto {
  @IsString()
  user_email: string;

  @IsNumber()
  group_id: number;

  @IsString()
  url: string;

  @IsString()
  @IsNotEmpty()
  contents: string;

  @IsJSON()
  @IsNotEmpty()
  selection: Prisma.JsonArray;
}

export class UpdateHighlightDto extends PartialType(CreateHighlightDto) {}
