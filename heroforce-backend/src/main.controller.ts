import { Controller, Get } from '@nestjs/common';

@Controller()
export class MainController {
  @Get()
  getApiInfo() {
    return {
      message: 'Bem-vindo à HeroForce API!',
      status: 'online',
      documentation: '/api',
      github: 'https://github.com/Joao-Cercena/HeroForce',
      frontend: 'https://heroforce.onrender.com',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealth() {
    return { status: 'healthy', uptime: process.uptime() };
  }
}
