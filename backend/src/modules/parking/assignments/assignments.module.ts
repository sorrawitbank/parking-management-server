import { Module } from '@nestjs/common';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { CalculationsModule } from './calulations/calculations.module';
import { StatusesModule } from './statuses/statuses.module';
import { SlotsModule } from '../slots/slots.module';
import { TenantsModule } from '../../tenants/tenants.module';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [
    CalculationsModule,
    DatabaseModule,
    SlotsModule,
    StatusesModule,
    TenantsModule,
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
})
export class AssignmentsModule {}
