import { Test, TestingModule } from '@nestjs/testing';
import { HighcommentController } from './highcomment.controller';

describe('HighcommentController', () => {
  let controller: HighcommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HighcommentController],
    }).compile();

    controller = module.get<HighcommentController>(HighcommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
