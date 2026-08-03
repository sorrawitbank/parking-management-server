import { Module } from '@nestjs/common';
import { BrandsModule } from './brands/brands.module';
import { TypesModule } from './types/types.module';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { DatabaseModule } from '../database/database.module';
import { ProvincesModule } from '../provinces/provinces.module';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [
    BrandsModule,
    DatabaseModule,
    ProvincesModule,
    TenantsModule,
    TypesModule,
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
