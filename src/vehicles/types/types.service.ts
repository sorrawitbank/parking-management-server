import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NotFound } from '../../common/errors/throw';
import DATABASE_CONNECTION from '../../database/database-connection';
import { vehicleTypes } from '../../database/database.schemas';
import type Database from '../../database/interfaces/database.interface';

@Injectable()
export class TypesService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async ensureVehicleTypeExists(vehicleTypeId: number) {
    const vehicleType = await this.db.query.vehicleTypes.findFirst({
      columns: {
        vehicleTypeId: true,
      },
      where: eq(vehicleTypes.vehicleTypeId, vehicleTypeId),
    });

    if (!vehicleType) {
      throw NotFound('vehicleType');
    }
  }

  async getVehicleTypes() {
    return this.db.query.vehicleTypes.findMany({
      columns: {
        createdAt: false,
        updatedAt: false,
      },
    });
  }
}
