import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentVariables } from './config/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService =
    app.get<ConfigService<EnvironmentVariables>>(ConfigService);
  const logger = new Logger('Bootstrap');

  const rawGlobalPrefix: unknown = configService.get('API_GLOBAL_PREFIX');
  const globalPrefix =
    typeof rawGlobalPrefix === 'string' ? rawGlobalPrefix : undefined;
  if (globalPrefix) {
    app.setGlobalPrefix(globalPrefix);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: false,
    }),
  );

  const rawShutdownFlag: unknown = configService.get(
    'API_ENABLE_SHUTDOWN_HOOKS',
  );
  const shouldEnableShutdownHooks =
    typeof rawShutdownFlag === 'boolean' ? rawShutdownFlag : true;

  if (shouldEnableShutdownHooks) {
    app.enableShutdownHooks();
  }

  const rawPort: unknown = configService.get('API_PORT', { infer: true });
  const port =
    typeof rawPort === 'number'
      ? rawPort
      : typeof rawPort === 'string'
        ? Number.parseInt(rawPort, 10) || 3000
        : 3000;
  await app.listen(port);
  logger.log(`HTTP service ready on ${await app.getUrl()}`);
}
bootstrap().catch((error: unknown) => {
  const logger = new Logger('Bootstrap');
  logger.error(
    'Failed to bootstrap application',
    error instanceof Error ? error.stack : undefined,
  );
  process.exit(1);
});
