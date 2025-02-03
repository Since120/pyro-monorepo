// apps/api/src/wizard/wizard.controller.ts

import { Body, Controller, Get, Post, Patch, Param } from '@nestjs/common';
import { WizardService } from './wizard.service';
import { Logger } from '@nestjs/common';

@Controller('wizard')
export class WizardController {
  constructor(private readonly wizardService: WizardService) {}

  // (1) /wizard/start
  private readonly logger = new Logger(WizardController.name);
  @Post('start')
  async startWizard(@Body() body: { userId: string; categoryId?: string }) {
    this.logger.log(`POST /wizard/start => userId=${body.userId}, categoryId=${body.categoryId}`);
    return this.wizardService.startWizard(body.userId, body.categoryId);
  }

  // (2) /wizard/step => trackingActive
  @Post('step')
  async updateWizardStep(
    @Body() body: { userId: string; trackingActive?: boolean },
  ) {
    this.logger.log(`POST /wizard/step => userId=${body.userId}, trackActive=${body.trackingActive}`);
    return this.wizardService.updateWizardSession(body);
  }


   /**
   * Neuer Endpoint:
   * POST /wizard/after-tracking
   * Body: { userId }
   * => Ruft wizardService.afterTrackingDecision(userId)
   * => Liefert { scenario, text, hasChannel, hasRole, roleId } usw.
   */
   @Post('after-tracking')
   async afterTracking(@Body() body: { userId: string }) {
    this.logger.log(`POST /wizard/after-tracking => userId=${body.userId}`);
     return this.wizardService.afterTrackingDecision(body.userId);
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
