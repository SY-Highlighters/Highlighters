import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFeedDto {
  @IsString()
  user_email: string;

  @IsNumber()
  group_id: number;

  @IsString()
  @IsNotEmpty()
  url: string;
}
