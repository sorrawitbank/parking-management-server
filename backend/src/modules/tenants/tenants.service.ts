import { Inject, Injectable } from '@nestjs/common';
import { eq, operators } from 'drizzle-orm';
import { GetTenantsQueryDto } from './dto/get-tenants-query.dto';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';
import {
  AlreadyExists,
  NotFound,
  Required,
  Unprocessable,
} from '../../common/errors/throw';
import { DATABASE_CONNECTION } from '../../database/database.constants';
import { tenants } from '../../database/database.schemas';
import { FindManyWhere, type Database } from '../../database/interfaces';

@Injectable()
export class TenantsService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async ensureTenantExists(tenantId: string) {
    const tenant = await this.db.query.tenants.findFirst({
      columns: {
        tenantId: true,
      },
      where: {
        tenantId: { eq: tenantId },
      },
    });

    if (!tenant) {
      throw NotFound('tenant');
    }
  }

  async getTenants(query: GetTenantsQueryDto) {
    const { page, limit, offset, isRenting, keyword } = query;

    const tenantQuery =
      isRenting === undefined
        ? this.db.query.tenants
        : isRenting
          ? this.db.query.rentingTenants
          : this.db.query.nonRentingTenants;

    const rawWhereClause: FindManyWhere<'tenants'>['RAW'] = keyword
      ? (table, { ilike, or }) =>
          or(
            ilike(table.name, `%${keyword}%`),
            ilike(table.phone, `%${keyword}%`),
            ilike(table.lineId, `%${keyword}%`),
            ilike(table.note, `%${keyword}%`),
          )!
      : undefined;

    const [result, total] = await Promise.all([
      tenantQuery.findMany({
        columns: {
          note: false,
          createdAt: false,
          updatedAt: false,
        },
        where: {
          RAW: rawWhereClause,
        },
        orderBy: {
          updatedAt: 'desc',
          tenantId: 'asc',
        },
        limit,
        offset,
      }),
      this.db.$count(
        tenants,
        rawWhereClause && rawWhereClause(tenants, operators),
      ),
    ]);

    return {
      tenants: result,
      pagination: new PaginationMetaDto(page, limit, total),
    };
  }

  async getTenantById(tenantId: string) {
    const tenant = await this.db.query.tenants.findFirst({
      where: {
        tenantId: { eq: tenantId },
      },
      with: {
        vehicles: {
          columns: {
            tenantId: false,
            note: false,
            createdAt: false,
            updatedAt: false,
          },
        },
      },
    });

    if (!tenant) {
      throw NotFound('tenant');
    }

    return tenant;
  }

  async createTenant(tenant: typeof tenants.$inferInsert) {
    const { phone, lineId } = tenant;

    await this.validateTenantUniqueFields({ phone, lineId });

    const [createdTenant] = await this.db
      .insert(tenants)
      .values(tenant)
      .returning();

    return createdTenant;
  }

  async updateTenant(
    tenantId: string,
    tenant: Partial<typeof tenants.$inferInsert>,
  ) {
    if (Object.keys(tenant).length === 0) {
      throw Required('body');
    }

    const { phone, lineId } = tenant;

    await this.validateTenantUniqueFields({
      phone,
      lineId,
      excludeTenantId: tenantId,
    });

    const updatedTenant = await this.db
      .update(tenants)
      .set(tenant)
      .where(eq(tenants.tenantId, tenantId))
      .returning();

    if (updatedTenant.length === 0) {
      throw NotFound('tenant');
    }

    return updatedTenant[0];
  }

  async deleteTenant(tenantId: string) {
    const assignment = await this.db.query.parkingAssignments.findFirst({
      columns: {
        assignmentId: true,
      },
      where: {
        tenantId: { eq: tenantId },
      },
    });

    if (assignment) {
      throw Unprocessable('tenant');
    }

    const deletedTenant = await this.db
      .delete(tenants)
      .where(eq(tenants.tenantId, tenantId))
      .returning();

    if (deletedTenant.length === 0) {
      throw NotFound('tenant');
    }
  }

  private async validateTenantUniqueFields(
    params: ValidateTenantUniqueFieldsParams,
  ) {
    const { phone, lineId, excludeTenantId } = params;

    if (!phone && !lineId) {
      return;
    }

    const uniqueFields = [
      {
        field: 'phone',
        key: 'phone',
        value: phone,
      },
      {
        field: 'lineId',
        key: 'lineId',
        value: lineId,
      },
    ] as const;

    const existingTenants = await this.db.query.tenants.findMany({
      where: {
        AND: [
          { tenantId: { ne: excludeTenantId } },
          {
            OR: [
              { phone: { eq: phone ?? undefined } },
              { lineId: { eq: lineId ?? undefined } },
            ],
          },
        ],
      },
    });

    const conflicts = uniqueFields.filter(
      ({ key, value }) =>
        value != null &&
        existingTenants.some((tenant) => tenant[key] === value),
    );

    if (conflicts.length > 0) {
      const fields = conflicts.map((item) => item.field);

      throw AlreadyExists(...fields);
    }
  }
}
