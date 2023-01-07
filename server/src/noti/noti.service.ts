import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';

@Injectable()
export class NotiService {
  constructor(private readonly prismaService: PrismaService) {}
}
