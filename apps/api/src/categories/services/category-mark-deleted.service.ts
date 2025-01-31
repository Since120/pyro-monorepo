// Pfad: apps/api/src/categories/services/category-mark-deleted.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoryMarkDeletedService {
  constructor(private prisma: PrismaService) {}

  async markAsDeletedInDiscord(discordCategoryId: string) {
    console.log('markAsDeletedInDiscord => discordCategoryId=', discordCategoryId);

    // (A) find record
    const cat = await this.prisma.category.findFirst({
      where: { discordCategoryId },
    });
    console.log('Found Category:', cat);

    if (!cat) {
      throw new Error(`Category not found for channelId=${discordCategoryId}`);
    }

    // (B) DB => "deletedInDiscord = true"
    const updated = await this.prisma.category.update({
      where: { id: cat.id },
      data: { deletedInDiscord: true },
    });
    console.log('Update done =>', updated);
    return updated;
  }
}
