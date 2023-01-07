import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNotiDto {
    user_email: string;
    group_id: number;
    url: string;
    title: string;
    