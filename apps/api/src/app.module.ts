import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ZonesModule } from './zones/zones.module';
import { RolesModule } from './roles/roles.module';
import { TrackingModule } from './tracking/tracking.module';
import { SetupModule } from './setup/setup.module'; // <-- Hier importieren
import { WizardModule } from './wizard/wizard.module';


@Module({
  imports: [CategoriesModule, ZonesModule, RolesModule, TrackingModule, CategoriesModule,
    SetupModule, WizardModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
