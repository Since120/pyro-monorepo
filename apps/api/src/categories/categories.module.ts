// Pfad: apps/api/src/categories/categories.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SetupModule } from '../setup/setup.module';

// Controller & Haupt-Service:
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

// Sub-Services:
import { CategoryCreateService } from './services/category-create.service';
import { CategoryUpdateService } from './services/category-update.service';
import { CategoryDeleteService } from './services/category-delete.service';
import { CategoryMarkDeletedService } from './services/category-mark-deleted.service';
import { CategoryRestoreService } from './services/category-restore.service';

@Module({
  imports: [PrismaModule, SetupModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService, // Haupt-Service (Delegation + findAll)
    CategoryCreateService,
    CategoryUpdateService,
    CategoryDeleteService,
    CategoryMarkDeletedService,
    CategoryRestoreService,
  ],
  exports: [CategoriesService], // optional
})
export class CategoriesModule {}
