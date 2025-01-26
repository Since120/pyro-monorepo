// KOMPLETTE Datei: apps/api/src/categories/categories.service.ts

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
    return this.prisma.category.findMany();
  }

  // -------------------------------------
  // 2) CREATE
  // -------------------------------------
  async createCategory(data: { name: string; categoryType: string; isVisible?: boolean }) {
    // 1) DB-Eintrag erstellen
    const newCat = await this.prisma.category.create({
      data: {
        name: data.name,
        categoryType: data.categoryType,
        isVisible: data.isVisible ?? true,
      },
    });

    // 2) Bot => in Discord anlegen
    try {
      const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
      const response = await axios.post(`${botUrl}/discord/categories`, {
        // Sende an den Bot nur "name"
        name: newCat.name,
      });
      const { discordChannelId } = response.data;

      if (!discordChannelId) {
        throw new Error('No channelId returned');
      }

      // 3) DB-Eintrag updaten => Speichere discordCategoryId
      await this.prisma.category.update({
        where: { id: newCat.id },
        data: { discordCategoryId: discordChannelId },
      });
    } catch (err) {
      console.error('Error while creating Discord category:', err);
      throw new HttpException(
        'Bot konnte die Discord-Kategorie nicht anlegen.',
        HttpStatus.BAD_GATEWAY
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
    }>
  ) {
    // 1) DB => updaten
    const updated = await this.prisma.category.update({
      where: { id: catId },
      data,
    });

    // 2) Falls Name geändert wird, rename in Discord
    if (data.name) {
      try {
        if (!updated.discordCategoryId) {
          console.warn(
            `updateCategory: Category ${catId} hat keine discordCategoryId => Überspringe rename.`
          );
        } else {
          const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
          await axios.patch(`${botUrl}/discord/categories`, {
            id: updated.discordCategoryId, // ID in Discord
            newName: data.name,
          });
        }
      } catch (err) {
        console.error('Error while updating Discord category:', err);
        throw new HttpException(
          'Bot konnte die Discord-Kategorie nicht umbenennen.',
          HttpStatus.BAD_GATEWAY
        );
      }
    }

    return updated;
  }

  // -------------------------------------
  // 4) DELETE
  // -------------------------------------
  async deleteCategory(catId: string) {
    // 1) DB => Eintrag holen
    const cat = await this.prisma.category.findUnique({
      where: { id: catId },
    });
    if (!cat) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    // NEU (Szenario 1): Prüfen, ob Zonen existieren
    const zoneCount = await this.prisma.zone.count({
      where: { categoryId: catId },
    });
    if (zoneCount > 0) {
      // => Fehlermeldung, die wir im Frontend abfangen können
      throw new HttpException(
        'Kategorie kann nicht gelöscht werden, solange noch Zonen damit verknüpft sind!',
        HttpStatus.BAD_REQUEST
      );
    }

    // 2) Bot => DELETE (nur wenn discordCategoryId existiert)
    if (cat.discordCategoryId) {
      try {
        const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
        await axios.delete(`${botUrl}/discord/categories/${cat.discordCategoryId}`);
      } catch (err) {
        console.error('Error while deleting Discord category:', err);
        throw new HttpException(
          'Bot konnte Discord-Kategorie nicht löschen.',
          HttpStatus.BAD_GATEWAY
        );
      }
    } else {
      console.warn(
        `deleteCategory: Category ${catId} hat KEINE discordCategoryId => Nix zu löschen in Discord`
      );
    }

    // 3) DB => Eintrag entfernen
    return this.prisma.category.delete({
      where: { id: catId },
    });
  }

  // -------------------------------------
  // 5) MARK AS DELETED (Bot hat Category gelöscht)
  // -------------------------------------
  async markAsDeletedInDiscord(discordCategoryId: string) {
    console.log('markAsDeletedInDiscord => discordCategoryId=', discordCategoryId);

    // 1) Datensatz finden
    const cat = await this.prisma.category.findFirst({
      where: { discordCategoryId: discordCategoryId },
    });
    console.log('Gefundene Category:', cat);

    if (!cat) {
      throw new Error(`Category not found for channelId=${discordCategoryId}`);
    }

    // 2) DB updaten => "deletedInDiscord = true"
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
    // 1) DB => find
    const cat = await this.prisma.category.findUnique({
      where: { id: catId },
    });
    if (!cat) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    // 2) Prüfen, ob "deletedInDiscord" = true
    if (!cat.deletedInDiscord) {
      throw new HttpException(
        'Kategorie ist gar nicht als gelöscht markiert.',
        HttpStatus.BAD_REQUEST
      );
    }

    // 3) Bot => neu anlegen
    try {
      const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
      const response = await axios.post(`${botUrl}/discord/categories`, {
        name: cat.name,
      });
      const { discordChannelId } = response.data;
      if (!discordChannelId) {
        throw new Error('No channelId returned from Bot');
      }

      // 4) DB => update
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
        HttpStatus.BAD_GATEWAY
      );
    }
  }
}
