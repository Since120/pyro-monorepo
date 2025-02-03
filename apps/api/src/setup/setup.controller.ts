// Pfad: apps/api/src/setup/setup.controller.ts

import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SetupService } from './setup.service';

@Controller('setup')
export class SetupController {
  constructor(private setupService: SetupService) {}

  @Get()
  async getSetup(@Query('categoryId') categoryId: string) {
    if (!categoryId) {
      throw new HttpException("Missing categoryId", HttpStatus.BAD_REQUEST);
    }
    const setup = await this.setupService.getSetupForCategory(categoryId);
    if (!setup) {
      throw new HttpException("No setup found", HttpStatus.NOT_FOUND);
    }
    return setup;
  }

  @Post('activate')
  async activate(@Body() body: { categoryId: string }) {
    if (!body.categoryId) {
      throw new HttpException('Missing categoryId', HttpStatus.BAD_REQUEST);
    }
    const setup = await this.setupService.activateSetup(body.categoryId);
    return { ok: true, data: setup };
  }

  @Post('deactivate')
  async deactivate(@Body() body: { categoryId: string }) {
    if (!body.categoryId) {
      throw new HttpException('Missing categoryId', HttpStatus.BAD_REQUEST);
    }
    await this.setupService.deactivateSetup(body.categoryId);
    return { ok: true };
  }
}
