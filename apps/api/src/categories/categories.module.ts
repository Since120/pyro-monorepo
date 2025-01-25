import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
// import { PrismaService } from '../prisma/prisma.service'; 
// Falls du das "PrismaService" in einem eigenen PrismaModule hast, importiere das hier.

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService], 
  // Falls du PrismaService brauchst, add to providers or import {PrismaModule}:
  // imports: [PrismaModule],
})
export class CategoriesModule {}
