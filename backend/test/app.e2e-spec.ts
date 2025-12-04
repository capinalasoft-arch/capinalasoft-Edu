import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

interface ServiceInfoResponse {
  name: string;
  version: string;
  environment: string;
  uptime: number;
  timestamp: string;
}

const isServiceInfoResponse = (
  value: unknown,
): value is ServiceInfoResponse => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return (
    typeof payload.name === 'string' &&
    typeof payload.version === 'string' &&
    typeof payload.environment === 'string' &&
    typeof payload.uptime === 'number' &&
    typeof payload.timestamp === 'string'
  );
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/').expect(200);
    const rawBody: unknown = response.body;
    if (!isServiceInfoResponse(rawBody)) {
      throw new Error('Unexpected payload received from / endpoint');
    }
    const body = rawBody;

    expect(typeof body.name).toBe('string');
    expect(typeof body.version).toBe('string');
    expect(typeof body.environment).toBe('string');
  });
});
