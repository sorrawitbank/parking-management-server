import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import DATABASE_CONNECTION from '../../database/database-connection';
import { vehicleBrands } from '../../database/database.schemas';
import type Database from '../../database/types/database';

@Injectable()
export class BrandsService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async getVehicleBrands() {
    return this.db.query.vehicleBrands.findMany();
  }

  async getVehicleBrandById(vehicleBrandId: number) {
    const vehicleBrand = await this.db.query.vehicleBrands.findFirst({
      where: eq(vehicleBrands.vehicleBrandId, vehicleBrandId),
    });

    if (!vehicleBrand) {
      throw new NotFoundException('Vehicle Brand Not Found');
    }

    return vehicleBrand;
  }
}
