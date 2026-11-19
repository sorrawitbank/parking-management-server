import { Inject, Injectable } from '@nestjs/common';
import { NotFound } from '../../common/errors/throw';
import DATABASE_CONNECTION from '../../database/database-connection';
import { type Database } from '../../database/interfaces';

@Injectable()
export class SlotsService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async ensureParkingSlotExists(slotId: string) {
    const parkingSlot = await this.db.query.parkingSlots.findFirst({
      columns: {
        slotId: true,
      },
      where: {
        slotId: { eq: slotId },
      },
    });

    if (!parkingSlot) {
      throw NotFound('slot');
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
    return this.db.query.parkingSlotsWithStatus.findMany();
  }

  async getParkingSlotsWithStatusById(slotId: string) {
    const parkingSlot = await this.db.query.parkingSlotsWithStatus.findFirst({
      where: {
        slotId: { eq: slotId },
      },
    });

    if (!parkingSlot) {
      throw NotFound('slot');
    }

    return parkingSlot;
  }
}
