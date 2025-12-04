import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/app.config';
import { EnvironmentVariables } from './config/environment';

export interface ServiceInfo {
  name: string;
  version: string;
  environment: string;
  uptime: number;
  timestamp: string;
}

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService<
      EnvironmentVariables & AppConfig
    >,
  ) {}

  getServiceInfo(): ServiceInfo {
    const appMeta = this.configService.get<AppConfig['app']>('app');
    const environment =
      this.configService.get<EnvironmentVariables['NODE_ENV']>('NODE_ENV') ??
      process.env.NODE_ENV ??
      'development';

    return {
      name: appMeta?.name ?? 'capinalasoft-edu-api',
      version: appMeta?.version ?? '0.0.1',
      environment,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
