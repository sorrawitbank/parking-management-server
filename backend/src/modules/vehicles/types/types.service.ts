import { Inject, Injectable } from '@nestjs/common';
import { NotFound } from '../../../common/errors/throw';
import DATABASE_CONNECTION from '../../../database/database-connection';
import { type Database } from '../../../database/interfaces';

@Injectable()
export class TypesService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async ensureVehicleTypeExists(vehicleTypeId: number) {
    const vehicleType = await this.db.query.vehicleTypes.findFirst({
      columns: {
        vehicleTypeId: true,
      },
      where: {
        vehicleTypeId: { eq: vehicleTypeId },
      },
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
