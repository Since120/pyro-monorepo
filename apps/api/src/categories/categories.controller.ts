import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    try {
      const cats = await this.categoriesService.findAll();
      return cats; // Nest.js serialisiert als JSON
    } catch (err) {
      console.error('Fehler in findAll():', err);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async create(@Body() body: { name: string; categoryType: string; isVisible?: boolean }) {
    if (!body.name || !body.categoryType) {
      throw new HttpException('name & categoryType required', HttpStatus.BAD_REQUEST);
    }
    try {
      const newCat = await this.categoriesService.createCategory(body);
      return newCat;
    } catch (err) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') catId: string,
    @Body() body: { name?: string; categoryType?: string; isVisible?: boolean; allowedRoles?: string[] },
  ) {
    if (!catId) {
      throw new HttpException('Missing categoryId', HttpStatus.BAD_REQUEST);
    }
    try {
      const updated = await this.categoriesService.updateCategory(catId, body);
      return updated;
    } catch (err) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') catId: string) {
    if (!catId) {
      throw new HttpException('Missing categoryId', HttpStatus.BAD_REQUEST);
    }
    try {
      const deleted = await this.categoriesService.deleteCategory(catId);
      return deleted;
    } catch (err) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
