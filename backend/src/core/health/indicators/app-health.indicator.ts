import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

@Injectable()
export class AppHealthIndicator extends HealthIndicator {
  isHealthy(): HealthIndicatorResult {
    const isHealthy = true;
    const result = this.getStatus('app', isHealthy, {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });

    if (!isHealthy) {
      throw new HealthCheckError('App check failed', result);
    }

    return result;
  }
}
