import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFeedDto {
  @IsString()
  @IsOptional()
  user_email: string;

  @IsNumber()
  @IsOptional()
  group_id: number;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  image: string;

  description: string;
}
