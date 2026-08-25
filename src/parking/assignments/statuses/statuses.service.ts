import { Inject, Injectable } from '@nestjs/common';
import DATABASE_CONNECTION from '../../../database/database-connection';
import type Database from '../../../database/interfaces/database.interface';

@Injectable()
export class StatusesService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async getParkingAssignmentStatuses() {
    return this.db.query.parkingAssignmentStatuses.findMany({
      columns: {
        createdAt: false,
        updatedAt: false,
      },
    });
  }
}
