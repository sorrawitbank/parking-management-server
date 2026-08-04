import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProvincesModule } from './provinces/provinces.module';
import { TenantsModule } from './tenants/tenants.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { BrandsModule as VehicleBrandsModule } from './vehicles/brands/brands.module';
import { TypesModule as VehicleTypesModule } from './vehicles/types/types.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TenantsModule,
    ProvincesModule,
    VehicleBrandsModule,
    VehicleTypesModule,
    VehiclesModule,
    RouterModule.register([
      {
        path: 'tenants',
        module: TenantsModule,
      },
      {
        path: 'provinces',
        module: ProvincesModule,
      },
      {
        path: 'vehicles',
        module: VehiclesModule,
        children: [
          {
            path: 'brands',
            module: VehicleBrandsModule,
          },
          {
            path: 'types',
            module: VehicleTypesModule,
          },
        ],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
