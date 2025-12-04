import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import type { Server } from 'http';
import request from 'supertest';
import { AppModule } from '../src/app.module';

interface InstitutionResponse {
  id: string;
  name: string;
  code: string;
  shortName: string | null;
  isActive: boolean;
}

function assertInstitutionResponse(
  payload: unknown,
): asserts payload is InstitutionResponse {
  if (
    typeof payload !== 'object' ||
    payload === null ||
    typeof (payload as Record<string, unknown>).id !== 'string'
  ) {
    throw new Error('Unexpected institution payload');
  }
}

function assertInstitutionArray(
  payload: unknown,
): asserts payload is InstitutionResponse[] {
  if (!Array.isArray(payload)) {
    throw new Error('Unexpected institutions payload');
  }

  payload.forEach(assertInstitutionResponse);
}

describe('InstitutionsModule (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let server: Server;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
    await prisma.institution.deleteMany();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    await app.init();
    server = app.getHttpServer() as Server;
  });

  afterEach(async () => {
    await prisma.institution.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('creates, lists, updates and soft deletes an institution', async () => {
    const payload = {
      name: 'Escola Central',
      code: 'ESC-01',
      shortName: 'EC',
    };

    const createResponse = await request(server)
      .post('/institutions')
      .send(payload)
      .expect(201);

    const createdPayload: unknown = createResponse.body;
    assertInstitutionResponse(createdPayload);
    const created = createdPayload;

    expect(created).toMatchObject({
      name: payload.name,
      code: payload.code,
      shortName: payload.shortName,
      isActive: true,
    });

    const institutionId = created.id;

    const listResponse = await request(server).get('/institutions').expect(200);

    const listPayload: unknown = listResponse.body;
    assertInstitutionArray(listPayload);
    expect(listPayload).toHaveLength(1);

    const detailResponse = await request(server)
      .get(`/institutions/${institutionId}`)
      .expect(200);

    const detailPayload: unknown = detailResponse.body;
    assertInstitutionResponse(detailPayload);
    expect(detailPayload).toMatchObject({
      id: institutionId,
      name: payload.name,
      code: payload.code,
    });

    const updated = await request(server)
      .patch(`/institutions/${institutionId}`)
      .send({ name: 'Escola Central Atualizada' })
      .expect(200);

    const updatedPayload: unknown = updated.body;
    assertInstitutionResponse(updatedPayload);
    expect(updatedPayload).toMatchObject({
      id: institutionId,
      name: 'Escola Central Atualizada',
    });

    await request(server).delete(`/institutions/${institutionId}`).expect(200);

    await request(server).get(`/institutions/${institutionId}`).expect(404);
  });
});
