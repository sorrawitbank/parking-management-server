import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NotFound } from '../../../common/errors/throw';
import DATABASE_CONNECTION from '../../../database/database-connection';
import { parkingSlotStatuses } from '../../../database/database.schemas';
import type Database from '../../../database/interfaces/database.interface';

@Injectable()
export class StatusesService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async getParkingSlotStatuses() {
    return this.db.query.parkingSlotStatuses.findMany({
      columns: {
        createdAt: false,
        updatedAt: false,
      },
    });
  }

  async getParkingSlotStatusById(slotStatusId: number) {
    const parkingSlotStatus = await this.db.query.parkingSlotStatuses.findFirst(
      {
        where: eq(parkingSlotStatuses.slotStatusId, slotStatusId),
      },
    );

    if (!parkingSlotStatus) {
      throw NotFound('parkingSlotStatus');
    }

    return parkingSlotStatus;
  }
}
