import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NotFound } from '../../../common/errors/throw';
import DATABASE_CONNECTION from '../../../database/database-connection';
import { parkingAssignmentStatuses } from '../../../database/database.schemas';
import type Database from '../../../database/types/database';

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

  async getParkingAssignmentStatusById(assignmentStatusId: number) {
    const parkingAssignmentStatus =
      await this.db.query.parkingAssignmentStatuses.findFirst({
        where: eq(
          parkingAssignmentStatuses.assignmentStatusId,
          assignmentStatusId,
        ),
      });

    if (!parkingAssignmentStatus) {
      throw NotFound('parkingAssignmentStatus');
    }

    return parkingAssignmentStatus;
  }
}
