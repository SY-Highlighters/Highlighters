import { Test, TestingModule } from '@nestjs/testing';
import { HighcommentService } from './highcomment.service';

describe('HighcommentService', () => {
  let service: HighcommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HighcommentService],
    }).compile();

    service = module.get<HighcommentService>(HighcommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
