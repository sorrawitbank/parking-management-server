import { Module } from '@nestjs/common';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { StatusesModule } from './statuses/statuses.module';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule, StatusesModule],
  controllers: [SlotsController],
  providers: [SlotsService],
})
export class SlotsModule {}
