// Pfad: apps/api/src/categories/services/category-delete.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SetupService } from '../../setup/setup.service';
import axios from 'axios';

@Injectable()
export class CategoryDeleteService {
  constructor(
    private prisma: PrismaService,
    private setupService: SetupService,
  ) {}

  /**
   * 4) DELETE (Soft-Delete)
   */
  async deleteCategory(catId: string) {
    // (A) load category
    const cat = await this.prisma.category.findUnique({
      where: { id: catId },
    });
    if (!cat) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    // (B) remove setup if active
    await this.setupService.deactivateSetup(catId);

    // (C) check zones
    const zoneCount = await this.prisma.zone.count({
      where: { categoryId: catId },
    });
    if (zoneCount > 0) {
      throw new HttpException(
        'Category cannot be deleted while Zones still exist!',
        HttpStatus.BAD_REQUEST,
      );
    }

    // (D) remove in Discord if needed
    if (cat.discordCategoryId) {
      try {
        const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
        await axios.delete(
          `${botUrl}/discord/categories/${cat.discordCategoryId}`,
        );
      } catch (err) {
        console.error('Error while deleting Discord category:', err);
        throw new HttpException(
          'Bot could not delete the Discord category.',
          HttpStatus.BAD_GATEWAY,
        );
      }
    } else {
      console.warn(
        `deleteCategory: Category ${catId} has NO discordCategoryId => skip Discord delete`,
      );
    }

    // (E) Soft-delete => set deletedInDiscord=true
    return this.prisma.category.update({
      where: { id: catId },
      data: { deletedInDiscord: true },
    });
  }

  /**
   * 7) HARD-DELETE
   */
  async deleteCategoryHard(catId: string) {
    // 1) check if zones exist
    const zoneCount = await this.prisma.zone.count({
      where: { categoryId: catId },
    });
    if (zoneCount > 0) {
      throw new HttpException(
        'Category cannot be hard-deleted while Zones still exist!',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 2) remove setup if active
    await this.setupService.deactivateSetup(catId);

    // 3) remove from Discord if needed
    const cat = await this.prisma.category.findUnique({ where: { id: catId } });
    if (cat?.discordCategoryId) {
      const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
      try {
        await axios.delete(
          `${botUrl}/discord/categories/${cat.discordCategoryId}`,
        );
      } catch (err) {
        console.error(
          '[HARD-DELETE] Error while deleting Discord category:',
          err,
        );
      }
    }

    // 4) truly remove DB record
    return this.prisma.category.delete({
      where: { id: catId },
    });
  }
}
