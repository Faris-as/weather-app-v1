import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('weather')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getWeather(@Query('location') location: string) {
    if (!location) {
      return { error: 'please provide a location' };
    }
    return this.appService.getWeather(location);
  }
  @Get('hi')
  getHello() {
    return 'server is running';
  }
}
