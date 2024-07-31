import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Healthcheck value"', () => {
      expect(appController.healthcheck().data).toBeDefined();
      expect(appController.healthcheck().data.maintenance).not.toBeNull();
      expect(appController.healthcheck().data.status).not.toBeNull();
      expect(appController.healthcheck().data.maintenance).not.toBeNull();
    });
  });
});
