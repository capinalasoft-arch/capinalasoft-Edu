import { Controller, Get } from '@nestjs/common';
import { AppService, ServiceInfo } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): ServiceInfo {
    return this.appService.getServiceInfo();
  }
}
