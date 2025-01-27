import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ZonesModule } from './zones/zones.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [CategoriesModule, ZonesModule, RolesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
