import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';
import { EnvironmentVariables } from '../config/environment';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService<EnvironmentVariables>) {
    const nodeEnv =
      configService.get<EnvironmentVariables['NODE_ENV']>('NODE_ENV') ??
      'development';
    const databaseUrl =
      configService.get<EnvironmentVariables['DATABASE_URL']>('DATABASE_URL') ??
      'file:./prisma/dev.db';

    const logs: Prisma.LogLevel[] =
      nodeEnv === 'development'
        ? ['query', 'warn', 'error']
        : ['warn', 'error'];

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
      log: logs,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
