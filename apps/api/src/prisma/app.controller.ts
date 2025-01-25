import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('users')
  async getUsers() {
    return this.appService.getAllUsers();
  }

  @Post('users')
  async addUser(@Body('name') name: string) {
    return this.appService.createUser(name);
  }
}