// Pfad: apps/api/src/categories/services/category-create.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SetupService } from '../../setup/setup.service';
import axios from 'axios';

@Injectable()
export class CategoryCreateService {
  constructor(
    private prisma: PrismaService,
    private setupService: SetupService,
  ) {}

  async createCategory(data: {
    name: string;
    categoryType: string;
    isVisible?: boolean;
    allowedRoles?: string[];
    trackingActive?: boolean;
    sendSetup?: boolean;
  }) {
    // (A) DB => create
    const newCat = await this.prisma.category.create({
      data: {
        name: data.name,
        categoryType: data.categoryType,
        isVisible: data.isVisible ?? true,
        allowedRoles: data.allowedRoles ?? [],
        trackingActive: data.trackingActive ?? false,
        sendSetup: data.sendSetup ?? false,
      },
    });

    // (B) Bot => POST /discord/categories
    try {
      const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
      const response = await axios.post(`${botUrl}/discord/categories`, {
        name: newCat.name,
        isVisible: newCat.isVisible,
        allowedRoles: newCat.allowedRoles,
      });
      const { discordChannelId } = response.data;

      if (!discordChannelId) {
        throw new Error('No channelId returned');
      }

      // (C) DB => update discordCategoryId
      const finalCat = await this.prisma.category.update({
        where: { id: newCat.id },
        data: { discordCategoryId: discordChannelId },
      });

      // (D) If sendSetup=true => activate setup
      if (finalCat.sendSetup === true) {
        try {
          await this.setupService.activateSetup(finalCat.id);
        } catch (err) {
          console.error('Error in setupService.activateSetup:', err);
        }
      }

      return finalCat;
    } catch (err) {
      console.error('Error while creating Discord category:', err);
      throw new HttpException(
        'Bot could not create the Discord category.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
