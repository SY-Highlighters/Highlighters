import { Test, TestingModule } from '@nestjs/testing';
import { DownloadController } from './download.controller';

describe('DownloadController', () => {
  let controller: DownloadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DownloadController],
    }).compile();

    controller = module.get<DownloadController>(DownloadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
