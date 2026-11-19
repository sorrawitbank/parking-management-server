import { Module } from '@nestjs/common';
import { ProvincesController } from './provinces.controller';
import { ProvincesService } from './provinces.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProvincesController],
  providers: [ProvincesService],
  exports: [ProvincesService],
})
export class ProvincesModule {}
