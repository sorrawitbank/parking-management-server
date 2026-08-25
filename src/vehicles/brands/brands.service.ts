import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NotFound } from '../../common/errors/throw';
import DATABASE_CONNECTION from '../../database/database-connection';
import { vehicleBrands } from '../../database/database.schemas';
import type Database from '../../database/interfaces/database.interface';

@Injectable()
export class BrandsService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async ensureVehicleBrandExists(vehicleBrandId: number) {
    const vehicleBrand = await this.db.query.vehicleBrands.findFirst({
      columns: {
        vehicleBrandId: true,
      },
      where: eq(vehicleBrands.vehicleBrandId, vehicleBrandId),
    });

    if (!vehicleBrand) {
      throw NotFound('vehicleBrand');
    }
  }

  async getVehicleBrands() {
    return this.db.query.vehicleBrands.findMany({
      columns: {
        createdAt: false,
        updatedAt: false,
      },
    });
  }
}
