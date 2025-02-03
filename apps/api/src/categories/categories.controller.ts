// Pfad: apps/api/src/categories/categories.controller.ts

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

  // 1) GET /categories + categories Name
  @Get()
  async findAll() {
    try {
      return await this.categoriesService.findAll();
    } catch (err) {
      console.error('Error in findAll():', err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') catId: string) {
    if (!catId)
      throw new HttpException('catId missing', HttpStatus.BAD_REQUEST);
    const category = await this.categoriesService.findOne(catId);
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  // 2) POST /categories
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
      return await this.categoriesService.createCategory(body);
    } catch (err) {
      console.error('Error in create():', err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 3) PATCH /categories/discord-deleted (Route for the Bot)
  @Patch('discord-deleted')
  async markAsDeletedInDiscord(@Body() body: { discordCategoryId: string }) {
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
      console.error('Error in markAsDeletedInDiscord:', err);
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 4) PATCH /categories/:id => Update
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
      return await this.categoriesService.updateCategory(catId, body);
    } catch (err) {
      console.error('Error in update():', err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 5) DELETE /categories/:id (Soft Delete)
  @Delete(':id')
  async remove(@Param('id') catId: string) {
    if (!catId) {
      throw new HttpException('Missing categoryId', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.categoriesService.deleteCategory(catId);
    } catch (err) {
      console.error('Error in remove():', err);
      if (err instanceof HttpException) throw err;

      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 6) PATCH /categories/restore/:id
  @Patch('restore/:id')
  async restoreCategoryInDiscord(@Param('id') catId: string) {
    try {
      const result =
        await this.categoriesService.restoreCategoryInDiscord(catId);
      return { ok: true, data: result };
    } catch (err) {
      console.error('Error in restoreCategoryInDiscord:', err);
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 7) DELETE /categories/:id/hard
  @Delete(':id/hard')
  async removeHard(@Param('id') catId: string) {
    if (!catId) {
      throw new HttpException('Missing categoryId', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.categoriesService.deleteCategoryHard(catId);
    } catch (err) {
      console.error('Error in removeHard():', err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
