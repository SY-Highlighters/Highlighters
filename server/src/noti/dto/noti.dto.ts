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
  nickname: string;
  feed_id: number;
  title: string;
  url: string;
  createdAt: Date;
}

export class DeleteNotiDto {
  noti_id: number;
  receiver_id: string;
}
