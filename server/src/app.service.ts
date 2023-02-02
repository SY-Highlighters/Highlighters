import { Injectable } from '@nestjs/common';
// import { ApmService } from 'nestjs-elastic-apm';

@Injectable()
export class AppService {
  // constructor(private readonly apmService: ApmService) {}
  getHello(): string {
    return 'Hello World!';
  }
}
