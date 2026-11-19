import { Module } from '@nestjs/common';
import { TypesController } from './types.controller';
import { TypesService } from './types.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TypesController],
  providers: [TypesService],
  exports: [TypesService],
})
export class TypesModule {}
