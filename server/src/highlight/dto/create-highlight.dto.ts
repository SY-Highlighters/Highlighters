import { Prisma } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateHighlightDto {
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  contents: string;

  @IsNotEmpty()
  selection: Prisma.JsonArray;
}
