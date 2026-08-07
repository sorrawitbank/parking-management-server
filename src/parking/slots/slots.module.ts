import { Module } from '@nestjs/common';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { StatusesModule } from './statuses/statuses.module';

@Module({
  imports: [StatusesModule],
  controllers: [SlotsController],
  providers: [SlotsService],
})
export class SlotsModule {}
