import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === 'app') {
                return { name: 'test-api', version: '1.2.3' };
              }

              if (key === 'NODE_ENV') {
                return 'test';
              }

              return undefined;
            },
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should expose service metadata', () => {
      const response = appController.root();

      expect(response).toMatchObject({
        name: 'test-api',
        version: '1.2.3',
        environment: 'test',
      });
    });
  });
});
