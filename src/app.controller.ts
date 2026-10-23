import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('General')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check', description: 'Returns a simple greeting to verify API health' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHello(): string {
    return this.appService.getHello();
  }
}
