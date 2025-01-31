// apps/api/src/wizard/wizard.controller.ts


import { Body, Controller, Get, Post, Patch, Param } from '@nestjs/common';
import { WizardService } from './wizard.service';

@Controller('wizard')
export class WizardController {
  constructor(private readonly wizardService: WizardService) {}

  // (1) /wizard/start
  @Post('start')
  async startWizard(@Body() body: { userId: string; categoryId?: string }) {
    return this.wizardService.startWizard(body.userId, body.categoryId);
  }

  // (2) /wizard/step => trackingActive
  @Post('step')
  async updateWizardStep(@Body() body: { userId: string; trackingActive?: boolean }) {
    return this.wizardService.updateWizardSession(body);
  }

  // (3) /wizard/finish
  @Patch('finish')
  async finishWizard(@Body() body: { userId: string }) {
    return this.wizardService.finishWizard(body.userId);
  }

  // (Optional) GET /wizard/:userId => Debug
  @Get(':userId')
  async getWizardSession(@Param('userId') userId: string) {
    return this.wizardService.getWizardSessionByUser(userId);
  }
}
