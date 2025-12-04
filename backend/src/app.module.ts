import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { validateEnvironment } from './config/environment';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './core/health/health.module';
import { PrismaModule } from './database/prisma.module';
import { InstitutionsModule } from './modules/institutions/institutions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env.test', '.env.local', '.env'],
      expandVariables: true,
      load: [appConfig],
      validate: validateEnvironment,
    }),
    PrismaModule,
    HealthModule,
    InstitutionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
