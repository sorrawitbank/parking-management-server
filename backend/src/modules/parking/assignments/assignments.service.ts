import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { addMonths, endOfMonth } from 'date-fns';
import { and, eq, operators } from 'drizzle-orm';
import { CalculationsService } from './calulations/calculations.service';
import { GetAssignmentSlotsBySlotIdQueryDto } from './dto/get-assignment-slots-by-slot-id-query.dto';
import { GetAssignmentsByTenantIdQueryDto } from './dto/get-assignments-by-tenant-id-query.dto';
import { GetAssignmentsQueryDto } from './dto/get-assignments-query.dto';
import { SlotsService } from '../slots/slots.service';
import { TenantsService } from '../../tenants/tenants.service';
import { PAY_CONFIG } from '../../../common/configs';
import { PaginationMetaDto } from '../../../common/dto/pagination-meta.dto';
import {
  AlreadyOccupied,
  NotFound,
  Required,
  Unavailable,
  Unprocessable,
} from '../../../common/errors/throw';
import { toStartOfDayUtc } from '../../../common/utils';
import DATABASE_CONNECTION from '../../../database/database-connection';
import {
  parkingAssignments,
  parkingAssignmentSlots,
} from '../../../database/database.schemas';
import { coalesce } from '../../../database/functions';
import { FindManyWhere, type Database } from '../../../database/interfaces';

@Injectable()
export class AssignmentsService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: Database,
    private calculationsService: CalculationsService,
    private tenantsService: TenantsService,
    private slotsService: SlotsService,
  ) {}

  async ensureAssignmentExists(assignmentId: number) {
    const assignment = await this.db.query.parkingAssignments.findFirst({
      columns: {
        assignmentId: true,
      },
      where: {
        assignmentId: { eq: assignmentId },
      },
    });

    if (!assignment) {
      throw NotFound('assignment');
    }
  }

  async getAssignments(query: GetAssignmentsQueryDto) {
    const { page, limit, offset, slotIds } = query;

    const rawWhereClause: FindManyWhere<'parkingAssignments'>['RAW'] = slotIds
      ? (table, { and, exists, inArray }) =>
          exists(
            this.db
              .select()
              .from(parkingAssignmentSlots)
              .where(
                and(
                  eq(parkingAssignmentSlots.assignmentId, table.assignmentId),
                  inArray(parkingAssignmentSlots.slotId, slotIds),
                ),
              ),
          )
      : undefined;

    const [result, total] = await Promise.all([
      this.db.query.parkingAssignments.findMany({
        columns: {
          tenantId: false,
          createdAt: false,
          updatedAt: false,
        },
        where: {
          RAW: rawWhereClause,
        },
        with: {
          tenant: {
            columns: {
              tenantId: true,
              name: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
          assignmentId: 'asc',
        },
        limit,
        offset,
      }),
      this.db.$count(
        parkingAssignments,
        rawWhereClause && rawWhereClause(parkingAssignments, operators),
      ),
    ]);

    return {
      assignments: result,
      pagination: new PaginationMetaDto(page, limit, total),
    };
  }

  async getActiveAssignments() {
    const activeAssignments =
      await this.db.query.activeParkingAssignments.findMany();

    return activeAssignments.map((assignment) => {
      const { tenantId, name, phone, lineId, note, ...rest } = assignment;

      return {
        tenant: { tenantId, name, phone, lineId, note },
        ...rest,
      };
    });
  }

  async getAssignmentById(assignmentId: number) {
    const assignment = await this.db.query.parkingAssignments.findFirst({
      columns: {
        tenantId: false,
      },
      where: {
        assignmentId: { eq: assignmentId },
      },
      with: {
        tenant: {
          columns: {
            tenantId: true,
            name: true,
          },
        },
        assignmentSlotsWithAssignedDays: {
          columns: {
            assignmentId: false,
          },
          orderBy: {
            assignedDate: 'desc',
          },
        },
      },
    });

    if (!assignment) {
      throw NotFound('assignment');
    }

    const { assignmentSlotsWithAssignedDays: assignmentSlots, ...rest } =
      assignment;

    return { assignmentSlots, ...rest };
  }

  async getAssignmentsByTenantId(
    tenantId: string,
    query: GetAssignmentsByTenantIdQueryDto,
  ) {
    await this.tenantsService.ensureTenantExists(tenantId);

    const { page, limit, offset } = query;

    const rawWhereClause: FindManyWhere<'parkingAssignments'>['RAW'] = (
      table,
      { eq },
    ) => eq(table.tenantId, tenantId);

    const [result, total] = await Promise.all([
      this.db.query.parkingAssignments.findMany({
        columns: {
          tenantId: false,
          createdAt: false,
          updatedAt: false,
        },
        where: {
          RAW: rawWhereClause,
        },
        with: {
          assignmentSlotsWithAssignedDays: {
            columns: {
              assignmentId: false,
            },
            orderBy: {
              assignedDate: 'desc',
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
          assignmentId: 'asc',
        },
        limit,
        offset,
      }),
      this.db.$count(
        parkingAssignments,
        rawWhereClause(parkingAssignments, operators),
      ),
    ]);

    return {
      assignments: result.map((assignment) => {
        const { assignmentSlotsWithAssignedDays: assignmentSlots, ...rest } =
          assignment;

        return { assignmentSlots, ...rest };
      }),
      pagination: new PaginationMetaDto(page, limit, total),
    };
  }

  async getAssignmentSlotsBySlotId(
    slotId: string,
    query: GetAssignmentSlotsBySlotIdQueryDto,
  ) {
    await this.slotsService.ensureParkingSlotExists(slotId);

    const { year } = query;

    return this.db.query.parkingAssignmentSlotsWithAssignedDays.findMany({
      columns: {
        assignmentId: false,
        slotId: false,
      },
      where: {
        AND: [
          { slotId: { eq: slotId } },
          {
            RAW: (table, { gte, sql }) =>
              gte(
                coalesce(table.endedDate, sql`CURRENT_DATE`),
                sql.raw(`'01-01-${year}'`),
              ),
          },
          {
            RAW: (table, { lt, sql }) =>
              lt(
                coalesce(table.endedDate, sql`CURRENT_DATE`),
                sql.raw(`'01-01-${year + 1}'`),
              ),
          },
        ],
      },
      with: {
        assignment: {
          columns: {
            assignmentId: true,
            monthlyFee: true,
          },
          with: {
            tenant: {
              columns: {
                tenantId: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async updateAssignment(
    assignmentId: number,
    assignment: Partial<typeof parkingAssignments.$inferInsert>,
  ) {
    if (Object.keys(assignment).length === 0) {
      throw Required('body');
    }

    const { tenantId } = assignment;

    await this.validateAssignmentForeignKeyFields({ tenantId });

    const updatedAssignment = await this.db.transaction(async (tx) => {
      const updatedAssignment = await tx
        .update(parkingAssignments)
        .set(assignment)
        .where(eq(parkingAssignments.assignmentId, assignmentId))
        .returning();

      if (updatedAssignment.length === 0) {
        throw NotFound('assignment');
      }

      return tx.query.parkingAssignments.findFirst({
        columns: {
          tenantId: false,
          createdAt: false,
        },
        where: {
          assignmentId: { eq: assignmentId },
        },
        with: {
          tenant: {
            columns: {
              tenantId: true,
              name: true,
            },
          },
        },
      });
    });

    return updatedAssignment!;
  }

  async rent(params: RentParams) {
    const { tenantId, slotId, monthlyFee, assignedDate } = params;

    await this.validateAssignmentForeignKeyFields({ tenantId });

    await this.validateAssignmentSlotForeignKeyFields({ slotId });

    const parkingSlotWithStatus =
      await this.slotsService.getParkingSlotsWithStatusById(slotId);

    if (parkingSlotWithStatus.slotStatusId === 2) {
      throw AlreadyOccupied('slot');
    } else if (parkingSlotWithStatus.slotStatusId === 3) {
      throw Unavailable('slot');
    }

    const existingAssignmentSlot =
      await this.db.query.parkingAssignmentSlots.findFirst({
        columns: {
          assignmentSlotId: true,
        },
        where: {
          AND: [
            { slotId: { eq: slotId } },
            { assignedDate: { lte: assignedDate.toISOString() } },
            { endedDate: { gt: assignedDate.toISOString() } },
          ],
        },
      });

    if (existingAssignmentSlot) {
      throw AlreadyOccupied('slot', 'assignedDate');
    }

    const paidUntilMonth =
      this.calculationsService.calculatePaidUntilMonth(assignedDate);

    const createdAssignment = await this.db.transaction(async (tx) => {
      const [createdAssignment] = await tx
        .insert(parkingAssignments)
        .values({ tenantId, paidUntilMonth, monthlyFee })
        .returning({ assignmentId: parkingAssignments.assignmentId });

      await tx.insert(parkingAssignmentSlots).values({
        assignmentId: createdAssignment.assignmentId,
        slotId,
        assignedDate: assignedDate.toISOString(),
      });

      return tx.query.parkingAssignments.findFirst({
        columns: {
          tenantId: false,
          updatedAt: false,
        },
        where: {
          assignmentId: { eq: createdAssignment.assignmentId },
        },
        with: {
          tenant: {
            columns: {
              tenantId: true,
              name: true,
            },
          },
        },
      });
    });

    return createdAssignment!;
  }

  async pay(assignmentId: number, params: PayParams) {
    const { months } = params;

    const assignment = await this.db.query.parkingAssignments.findFirst({
      columns: {
        paidUntilMonth: true,
      },
      where: {
        assignmentId: { eq: assignmentId },
      },
    });

    if (!assignment) {
      throw NotFound('assignment');
    }

    const newPaidUntilMonth = endOfMonth(
      addMonths(assignment.paidUntilMonth, months),
    );

    if (
      newPaidUntilMonth >
      endOfMonth(addMonths(new Date(), PAY_CONFIG.MAX_PREPAID_MONTHS))
    ) {
      throw Unprocessable('months');
    }

    return this.db.transaction(async (tx) => {
      const [paidAssignment] = await tx
        .update(parkingAssignments)
        .set({
          paidUntilMonth: newPaidUntilMonth.toISOString(),
        })
        .where(eq(parkingAssignments.assignmentId, assignmentId))
        .returning({
          assignmentId: parkingAssignments.assignmentId,
          paidUntilMonth: parkingAssignments.paidUntilMonth,
        });

      return paidAssignment;
    });
  }

  async move(assignmentId: number, params: MoveParams) {
    const { slotId } = params;

    await this.ensureAssignmentExists(assignmentId);

    const parkingSlotWithStatus =
      await this.slotsService.getParkingSlotsWithStatusById(slotId);

    if (parkingSlotWithStatus.slotStatusId === 2) {
      throw AlreadyOccupied('slot');
    } else if (parkingSlotWithStatus.slotStatusId === 3) {
      throw Unavailable('slot');
    }

    const today = toStartOfDayUtc(new Date()).toISOString().slice(0, 10);

    const todayAssignmentSlot =
      await this.db.query.parkingAssignmentSlots.findFirst({
        columns: {
          assignmentSlotId: true,
          slotId: true,
        },
        where: {
          AND: [
            { assignmentId: { eq: assignmentId } },
            { endedDate: { eq: today } },
          ],
        },
      });

    await this.db.transaction(async (tx) => {
      if (todayAssignmentSlot) {
        if (todayAssignmentSlot.slotId === slotId) {
          await tx
            .delete(parkingAssignmentSlots)
            .where(
              and(
                eq(parkingAssignmentSlots.assignmentId, assignmentId),
                eq(parkingAssignmentSlots.isActive, true),
              ),
            );

          await tx
            .update(parkingAssignmentSlots)
            .set({ endedDate: null, isActive: true })
            .where(
              eq(
                parkingAssignmentSlots.assignmentSlotId,
                todayAssignmentSlot.assignmentSlotId,
              ),
            );
        } else {
          await tx
            .update(parkingAssignmentSlots)
            .set({ slotId })
            .where(
              and(
                eq(parkingAssignmentSlots.assignmentId, assignmentId),
                eq(parkingAssignmentSlots.isActive, true),
              ),
            );
        }
      } else {
        await tx
          .update(parkingAssignmentSlots)
          .set({
            endedDate: today,
            isActive: false,
          })
          .where(
            and(
              eq(parkingAssignmentSlots.assignmentId, assignmentId),
              eq(parkingAssignmentSlots.isActive, true),
            ),
          );

        await tx.insert(parkingAssignmentSlots).values({
          assignmentId,
          slotId,
          assignedDate: today,
        });
      }
    });

    return { assignmentId, slotId };
  }

  async cancel(assignmentId: number) {
    await this.ensureAssignmentExists(assignmentId);

    const activeAssignmentSlot =
      await this.db.query.parkingAssignmentSlots.findFirst({
        columns: {
          assignmentSlotId: true,
        },
        where: {
          AND: [
            { assignmentId: { eq: assignmentId } },
            { isActive: { eq: true } },
          ],
        },
      });

    if (!activeAssignmentSlot) {
      throw Unprocessable('assignment');
    }

    const today = toStartOfDayUtc(new Date()).toISOString().slice(0, 10);

    await this.db.transaction(async (tx) => {
      await tx
        .update(parkingAssignmentSlots)
        .set({
          endedDate: today,
          isActive: false,
        })
        .where(
          and(
            eq(parkingAssignmentSlots.assignmentId, assignmentId),
            eq(parkingAssignmentSlots.isActive, true),
          ),
        );
    });

    return { assignmentId, endedDate: today, isActive: false };
  }

  private async validateAssignmentForeignKeyFields(
    params: ValidateAssignmentForeignKeyFieldsParams,
  ) {
    const { tenantId } = params;

    if (!tenantId) {
      return;
    }

    const results = await Promise.allSettled([
      tenantId ? this.tenantsService.ensureTenantExists(tenantId) : undefined,
    ]);

    const fields: string[] = [];
    const foreignKeyFields = [
      {
        field: 'tenant',
        value: tenantId,
      },
    ] as const;

    foreignKeyFields.forEach(({ field, value }, index) => {
      if (
        value != null &&
        results[index].status === 'rejected' &&
        results[index].reason instanceof NotFoundException
      ) {
        fields.push(field);
      } else if (results[index].status === 'rejected') {
        throw results[index].reason;
      }
    });

    if (fields.length > 0) {
      throw NotFound(...fields);
    }
  }

  private async validateAssignmentSlotForeignKeyFields(
    params: ValidateAssignmentSlotForeignKeyFieldsParams,
  ) {
    const { assignmentId, slotId } = params;

    if (!assignmentId && !slotId) {
      return;
    }

    const results = await Promise.allSettled([
      assignmentId ? this.ensureAssignmentExists(assignmentId) : undefined,
      slotId ? this.slotsService.ensureParkingSlotExists(slotId) : undefined,
    ]);

    const fields: string[] = [];
    const foreignKeyFields = [
      {
        field: 'assignment',
        value: assignmentId,
      },
      {
        field: 'parkingSlot',
        value: slotId,
      },
    ] as const;

    foreignKeyFields.forEach(({ field, value }, index) => {
      if (
        value != null &&
        results[index].status === 'rejected' &&
        results[index].reason instanceof NotFoundException
      ) {
        fields.push(field);
      } else if (results[index].status === 'rejected') {
        throw results[index].reason;
      }
    });

    if (fields.length > 0) {
      throw NotFound(...fields);
    }
  }
}
