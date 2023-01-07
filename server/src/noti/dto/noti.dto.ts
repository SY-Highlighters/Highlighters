import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNotiDto {
  user_email: string;
  group_id: number;
  nickname: string;
  contents: string;
  url: string;
}
