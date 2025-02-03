// Pfad: apps/api/src/categories/categories.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryCreateService } from './services/category-create.service';
import { CategoryUpdateService } from './services/category-update.service';
import { CategoryDeleteService } from './services/category-delete.service';
import { CategoryMarkDeletedService } from './services/category-mark-deleted.service';
import { CategoryRestoreService } from './services/category-restore.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,

    // Unsere Sub-Services:
    private categoryCreate: CategoryCreateService,
    private categoryUpdate: CategoryUpdateService,
    private categoryDelete: CategoryDeleteService,
    private categoryMarkDeleted: CategoryMarkDeletedService,
    private categoryRestore: CategoryRestoreService,
  ) {}

  /**
   * 1) READ ALL
   */
  findAll() {
    // Standard: Zeigt alle Categories inkl. deletedInDiscord usw.
    // (evtl. where: { deletedInDiscord: false } falls du nur "aktive" willst)
    return this.prisma.category.findMany();
  }

  /**
   * 2) CREATE - Delegation
   */
  createCategory(data: {
    name: string;
    categoryType: string;
    isVisible?: boolean;
    allowedRoles?: string[];
    trackingActive?: boolean;
    sendSetup?: boolean;
  }) {
    return this.categoryCreate.createCategory(data);
  }

  /**
   * 3) UPDATE - Delegation
   */
  updateCategory(
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
    return this.categoryUpdate.updateCategory(catId, data);
  }

  /**
   * 4) DELETE - Delegation
   */
  deleteCategory(catId: string) {
    return this.categoryDelete.deleteCategory(catId);
  }

  /**
   * 4b) HARD-DELETE
   */
  deleteCategoryHard(catId: string) {
    return this.categoryDelete.deleteCategoryHard(catId);
  }

  /**
   * 5) MARK AS DELETED
   */
  markAsDeletedInDiscord(discordCategoryId: string) {
    return this.categoryMarkDeleted.markAsDeletedInDiscord(discordCategoryId);
  }

  /**
   * 6) RESTORE
   */
  restoreCategoryInDiscord(catId: string) {
    return this.categoryRestore.restoreCategoryInDiscord(catId);
  }

  /**
   * 7) Find Category Name
   */
  findOne(catId: string) {
    return this.prisma.category.findUnique({
      where: { id: catId },
    });
  }
}
