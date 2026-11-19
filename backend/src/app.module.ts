import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AssignmentsModule as ParkingAssignmentsModule } from './parking/assignments/assignments.module';
import { StatusesModule as ParkingAssignmentStatusesModule } from './parking/assignments/statuses/statuses.module';
import { SlotsModule as ParkingSlotsModule } from './parking/slots/slots.module';
import { StatusesModule as ParkingSlotStatusesModule } from './parking/slots/statuses/statuses.module';
import { ProvincesModule } from './provinces/provinces.module';
import { TenantsModule } from './tenants/tenants.module';
import { BrandsModule as VehicleBrandsModule } from './vehicles/brands/brands.module';
import { TypesModule as VehicleTypesModule } from './vehicles/types/types.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ParkingAssignmentStatusesModule,
    ParkingAssignmentsModule,
    ParkingSlotStatusesModule,
    ParkingSlotsModule,
    ProvincesModule,
    TenantsModule,
    VehicleBrandsModule,
    VehicleTypesModule,
    VehiclesModule,
    RouterModule.register([
      {
        path: 'parking',
        children: [
          {
            path: 'assignments',
            module: ParkingAssignmentsModule,
            children: [
              {
                path: 'statuses',
                module: ParkingAssignmentStatusesModule,
              },
            ],
          },
          {
            path: 'slots',
            module: ParkingSlotsModule,
            children: [
              {
                path: 'statuses',
                module: ParkingSlotStatusesModule,
              },
            ],
          },
        ],
      },
      {
        path: 'provinces',
        module: ProvincesModule,
      },
      {
        path: 'tenants',
        module: TenantsModule,
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
