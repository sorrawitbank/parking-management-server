import { Module } from '@nestjs/common';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { StatusesModule } from './statuses/statuses.module';
import { SlotsModule } from '../slots/slots.module';
import { DatabaseModule } from '../../database/database.module';
import { TenantsModule } from '../../tenants/tenants.module';

@Module({
  imports: [DatabaseModule, SlotsModule, StatusesModule, TenantsModule],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
})
export class AssignmentsModule {}
