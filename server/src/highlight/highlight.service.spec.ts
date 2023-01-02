import { Test, TestingModule } from '@nestjs/testing';
import { HighlightService } from './highlight.service';

describe('HighlightService', () => {
  let service: HighlightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HighlightService],
    }).compile();

    service = module.get<HighlightService>(HighlightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
