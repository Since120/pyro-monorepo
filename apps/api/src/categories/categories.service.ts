// apps/api/src/categories/categories.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // -------------------------------------
  // 1) Nur Lesen
  // -------------------------------------
  findAll() {
    // Standard: Zeigt alle Categories inkl. deletedInDiscord usw.
    // Falls du sie filtern willst (z. B. nur "deletedInDiscord = false"), 
    // könntest du hier "where: { deletedInDiscord: false }" ergänzen.
    return this.prisma.category.findMany();
  }

  // -------------------------------------
  // 2) CREATE
  // -------------------------------------
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
      });
      const { discordChannelId } = response.data;

      if (!discordChannelId) {
        throw new Error('No channelId returned');
      }

      // (C) DB => update discordCategoryId
      await this.prisma.category.update({
        where: { id: newCat.id },
        data: { discordCategoryId: discordChannelId },
      });
    } catch (err) {
      console.error('Error while creating Discord category:', err);
      throw new HttpException(
        'Bot konnte die Discord-Kategorie nicht anlegen.',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return newCat;
  }

  // -------------------------------------
  // 3) UPDATE
  // -------------------------------------
  async updateCategory(
    catId: string,
    data: Partial<{
      name: string;
      categoryType: string;
      isVisible: boolean;
      allowedRoles: string[];
      trackingActive: boolean;
      sendSetup: boolean;
    }>,
  ) {
    // (A) DB => update
    const updated = await this.prisma.category.update({
      where: { id: catId },
      data,
    });

    // (B) Falls Name geändert => rename in Discord
    if (data.name) {
      try {
        if (!updated.discordCategoryId) {
          console.warn(
            `updateCategory: Category ${catId} hat keine discordCategoryId => Überspringe rename.`,
          );
        } else {
          const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
          await axios.patch(`${botUrl}/discord/categories`, {
            id: updated.discordCategoryId,
            newName: data.name,
          });
        }
      } catch (err) {
        console.error('Error while updating Discord category:', err);
        throw new HttpException(
          'Bot konnte die Discord-Kategorie nicht umbenennen.',
          HttpStatus.BAD_GATEWAY,
        );
      }
    }

    return updated;
  }

  // -------------------------------------
  // 4) DELETE
  // -------------------------------------
  async deleteCategory(catId: string) {
    // (A) DB => Eintrag holen
    const cat = await this.prisma.category.findUnique({
      where: { id: catId },
    });
    if (!cat) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    // (B) Prüfen, ob noch Zonen existieren
    const zoneCount = await this.prisma.zone.count({
      where: { categoryId: catId },
    });
    if (zoneCount > 0) {
      throw new HttpException(
        'Kategorie kann nicht gelöscht werden, solange noch Zonen damit verknüpft sind!',
        HttpStatus.BAD_REQUEST,
      );
    }

    // (C) Bot => DELETE /discord/categories/:discordCategoryId
    if (cat.discordCategoryId) {
      try {
        const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
        await axios.delete(`${botUrl}/discord/categories/${cat.discordCategoryId}`);
      } catch (err) {
        console.error('Error while deleting Discord category:', err);
        throw new HttpException(
          'Bot konnte Discord-Kategorie nicht löschen.',
          HttpStatus.BAD_GATEWAY,
        );
      }
    } else {
      console.warn(
        `deleteCategory: Category ${catId} hat KEINE discordCategoryId => kein Discord-Delete`,
      );
    }

     // (D) Soft Delete => Set "deletedInDiscord = true"
     // So bleibt der Eintrag in der DB erhalten.
     return this.prisma.category.update({
       where: { id: catId },
       data: { deletedInDiscord: true },
     });
  }

  // -------------------------------------
  // 5) MARK AS DELETED (Bot hat Category gelöscht)
  // -------------------------------------
  async markAsDeletedInDiscord(discordCategoryId: string) {
    console.log('markAsDeletedInDiscord => discordCategoryId=', discordCategoryId);

    // (A) Datensatz finden
    const cat = await this.prisma.category.findFirst({
      where: { discordCategoryId },
    });
    console.log('Gefundene Category:', cat);

    if (!cat) {
      throw new Error(`Category not found for channelId=${discordCategoryId}`);
    }

    // (B) DB => "deletedInDiscord = true"
    try {
      const updated = await this.prisma.category.update({
        where: { id: cat.id },
        data: { deletedInDiscord: true },
      });
      console.log('Update done =>', updated);
      return updated;
    } catch (err) {
      console.error('Prisma Update Fehler =>', err);
      throw err;
    }
  }

  // -------------------------------------
  // 6) RESTORE (NEU)
  // -------------------------------------
  async restoreCategoryInDiscord(catId: string) {
    // (A) DB => load
    const cat = await this.prisma.category.findUnique({
      where: { id: catId },
    });
    if (!cat) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    // (B) Prüfen => deletedInDiscord?
    if (!cat.deletedInDiscord) {
      throw new HttpException(
        'Kategorie ist gar nicht als gelöscht markiert.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // (C) Bot => neu anlegen
    try {
      const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
      const response = await axios.post(`${botUrl}/discord/categories`, {
        name: cat.name,
      });
      const { discordChannelId } = response.data;
      if (!discordChannelId) {
        throw new Error('No channelId returned from Bot');
      }

      // (D) DB => update
      const updated = await this.prisma.category.update({
        where: { id: cat.id },
        data: {
          discordCategoryId: discordChannelId,
          deletedInDiscord: false,
        },
      });
      return updated;
    } catch (err) {
      console.error('restoreCategoryInDiscord -> Bot error:', err);
      throw new HttpException(
        'Bot konnte die Discord-Kategorie nicht neu anlegen.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
