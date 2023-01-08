import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNotiDto {
  user_email: string;
  group_id: number;
  nickname: string;
  contents: string;
  url: string;
}

export class ShowNotiDto {
  id: number;
  contents: string;
  user_id: string;
  nickname: string;
  feed_id: number;
  title: string;
  url: string;
  createdAt: Date;
}
