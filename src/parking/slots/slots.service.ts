import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NotFound } from '../../common/errors/throw';
import DATABASE_CONNECTION from '../../database/database-connection';
import {
  parkingSlots,
  parkingSlotsWithStatus,
} from '../../database/database.schemas';
import type Database from '../../database/interfaces/database.interface';

@Injectable()
export class SlotsService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async ensureParkingSlotExists(slotId: string) {
    const parkingSlot = await this.db.query.parkingSlots.findFirst({
      columns: {
        slotId: true,
      },
      where: eq(parkingSlots.slotId, slotId),
    });

    if (!parkingSlot) {
      throw NotFound('parkingSlot');
    }
  }

  async getParkingSlots() {
    return this.db.query.parkingSlots.findMany({
      columns: {
        createdAt: false,
        updatedAt: false,
      },
    });
  }

  async getParkingSlotsWithStatus() {
    return this.db.select().from(parkingSlotsWithStatus);
  }

  async getParkingSlotsWithStatusById(slotId: string) {
    const parkingSlot = await this.db
      .select()
      .from(parkingSlotsWithStatus)
      .where(eq(parkingSlotsWithStatus.slotId, slotId));

    if (parkingSlot.length === 0) {
      throw NotFound('parkingSlot');
    }

    return parkingSlot[0];
  }
}
