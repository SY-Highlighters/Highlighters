import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsOptional()
  user_email: string;

  @IsNumber()
  @IsOptional()
  group_id: number;

  @IsNumber()
  @IsOptional()
  feed_id: number;

  @IsString()
  contents: string;
}

export class ShowCommentDto {
  id: number;
  contents: string;
  nickname: string;
  profile_image: string;
  createdAt: Date;
}
