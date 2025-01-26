import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ZonesModule } from './zones/zones.module';

@Module({
  imports: [CategoriesModule, ZonesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
