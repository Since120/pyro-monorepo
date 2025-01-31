// apps/api/src/setup/setup.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { SetupService } from './setup.service';

@Controller('setup')
export class SetupController {
  constructor(private setupService: SetupService) {}

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
