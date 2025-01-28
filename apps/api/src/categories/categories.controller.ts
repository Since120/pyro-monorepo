// KOMPLETTE Datei: apps/api/src/categories/categories.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // -----------------------------------
  // 1) GET /categories
  // -----------------------------------
  @Get()
  async findAll() {
    try {
      const cats = await this.categoriesService.findAll();
      return cats;
    } catch (err) {
      console.error('Fehler in findAll():', err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // -----------------------------------
  // 2) POST /categories
  // -----------------------------------
  @Post()
  async create(
    @Body()
    body: {
      name: string;
      categoryType: string;
      isVisible?: boolean;
      allowedRoles?: string[];
      trackingActive?: boolean;
      sendSetup?: boolean;
    },
  ) {
    if (!body.name || !body.categoryType) {
      throw new HttpException(
        'name & categoryType required',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const newCat = await this.categoriesService.createCategory({
        name: body.name,
        categoryType: body.categoryType,
        isVisible: body.isVisible,
        allowedRoles: body.allowedRoles ?? [],
        trackingActive: body.trackingActive,
        sendSetup: body.sendSetup,
      });
      return newCat;
    } catch (err) {
      console.error('Fehler in create():', err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // -----------------------------------
  // 3) PATCH /categories/discord-deleted
  // (Route für den Bot: Channel gelöscht)
  // -----------------------------------
  @Patch('discord-deleted')
  async markAsDeletedInDiscord(@Body() body: { discordCategoryId: string }) {
    // ACHTUNG: Wir nennen es im Body "discordCategoryId"
    if (!body.discordCategoryId) {
      throw new HttpException(
        'Missing discordCategoryId',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const res = await this.categoriesService.markAsDeletedInDiscord(
        body.discordCategoryId,
      );
      return { ok: true, data: res };
    } catch (err) {
      console.error('Fehler in markAsDeletedInDiscord:', err);
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // -----------------------------------
  // 4) PATCH /categories/:id
  //    => Update Category
  // -----------------------------------
  @Patch(':id')
  async update(
    @Param('id') catId: string,
    @Body()
    body: {
      name?: string;
      categoryType?: string;
      isVisible?: boolean;
      allowedRoles?: string[];
      trackingActive?: boolean;
      sendSetup?: boolean;
    },
  ) {
    if (!catId) {
      throw new HttpException('Missing categoryId', HttpStatus.BAD_REQUEST);
    }
    try {
      const updated = await this.categoriesService.updateCategory(catId, {
        name: body.name,
        categoryType: body.categoryType,
        isVisible: body.isVisible,
        allowedRoles: body.allowedRoles,
        trackingActive: body.trackingActive, // NEU
        sendSetup: body.sendSetup,           // NEU
      });
      return updated;
    } catch (err) {
      console.error('Fehler in update():', err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // -----------------------------------
  // 5) DELETE /categories/:id
  // -----------------------------------
  @Delete(':id')
  async remove(@Param('id') catId: string) {
    if (!catId) {
      throw new HttpException('Missing categoryId', HttpStatus.BAD_REQUEST);
    }
    try {
      const deleted = await this.categoriesService.deleteCategory(catId);
      return deleted;
    } catch (err) {
      console.error('Fehler in remove():', err);

      // NEU: Wenn es schon eine HttpException ist, re-throw sie
      if (err instanceof HttpException) {
        throw err;
      }

      // Sonst: 500
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Patch('restore/:id')
  async restoreCategoryInDiscord(@Param('id') catId: string) {
    try {
      const result =
        await this.categoriesService.restoreCategoryInDiscord(catId);
      return { ok: true, data: result };
    } catch (err) {
      console.error('Fehler in restoreCategoryInDiscord:', err);

      if (err instanceof HttpException) throw err;
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
