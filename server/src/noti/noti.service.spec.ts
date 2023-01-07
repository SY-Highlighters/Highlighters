import { Test, TestingModule } from '@nestjs/testing';
import { NotiService } from './noti.service';

describe('NotiService', () => {
  let service: NotiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotiService],
    }).compile();

    service = module.get<NotiService>(NotiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
