import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import DATABASE_CONNECTION from '../../database/database-connection';
import { vehicleTypes } from '../../database/database.schemas';
import type Database from '../../database/types/database';

@Injectable()
export class TypesService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async getVehicleTypes() {
    return this.db.query.vehicleTypes.findMany();
  }

  async getVehicleTypeById(vehicleTypeId: number) {
    const vehicleType = await this.db.query.vehicleTypes.findFirst({
      where: eq(vehicleTypes.vehicleTypeId, vehicleTypeId),
    });

    if (!vehicleType) {
      throw new NotFoundException('Vehicle Type Not Found');
    }

    return vehicleType;
  }
}
