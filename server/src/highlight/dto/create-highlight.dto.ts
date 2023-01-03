import { Prisma } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateHighlightDto {
  user_email: string;

  group_id: number;

  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  contents: string;

  @IsNotEmpty()
  selection: Prisma.JsonArray;
}
