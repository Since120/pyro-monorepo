import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CategoriesService {
  private prisma = new PrismaClient();

  // read all 
  findAll() {
    return this.prisma.category.findMany();
  }

  // create
  async createCategory(data: { name: string; categoryType: string; isVisible?: boolean }) {
    const newCat = await this.prisma.category.create({
      data: {
        name: data.name,
        categoryType: data.categoryType,
        isVisible: data.isVisible ?? true,
      },
    });
    return newCat;
  }

  // update
  async updateCategory(catId: string, data: Partial<{ name: string; categoryType: string; isVisible: boolean; allowedRoles: string[] }>) {
    const updated = await this.prisma.category.update({
      where: { id: catId },
      data,
    });
    return updated;
  }

  // delete
  async deleteCategory(catId: string) {
    const deleted = await this.prisma.category.delete({
      where: { id: catId },
    });
    return deleted;
  }
}
