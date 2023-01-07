import { Test, TestingModule } from '@nestjs/testing';
import { NotiController } from './noti.controller';

describe('NotiController', () => {
  let controller: NotiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotiController],
    }).compile();

    controller = module.get<NotiController>(NotiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
