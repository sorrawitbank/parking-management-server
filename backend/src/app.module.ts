import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AssignmentsModule as ParkingAssignmentsModule } from './modules/parking/assignments/assignments.module';
import { CalculationsModule as ParkingAssignmentCalculationsModule } from './modules/parking/assignments/calulations/calculations.module';
import { StatusesModule as ParkingAssignmentStatusesModule } from './modules/parking/assignments/statuses/statuses.module';
import { SlotsModule as ParkingSlotsModule } from './modules/parking/slots/slots.module';
import { StatusesModule as ParkingSlotStatusesModule } from './modules/parking/slots/statuses/statuses.module';
import { ProvincesModule } from './modules/provinces/provinces.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { BrandsModule as VehicleBrandsModule } from './modules/vehicles/brands/brands.module';
import { TypesModule as VehicleTypesModule } from './modules/vehicles/types/types.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { RequestLoggerMiddleware } from './request-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ParkingAssignmentCalculationsModule,
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
                path: 'calculations',
                module: ParkingAssignmentCalculationsModule,
              },
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
