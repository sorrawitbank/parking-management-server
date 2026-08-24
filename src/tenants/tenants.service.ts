import { Inject, Injectable } from '@nestjs/common';
import { and, asc, count, desc, eq, ilike, ne, or, SQL } from 'drizzle-orm';
import { GetTenantsQueryDto } from './dto/get-tenants-query.dto';
import { PaginationMetaDto } from '../common/dto/pagination-meta.dto';
import { AlreadyExists, NotFound, Required } from '../common/errors/throw';
import DATABASE_CONNECTION from '../database/database-connection';
import {
  nonRentingTenants,
  rentingTenants,
  tenants,
} from '../database/database.schemas';
import type Database from '../database/interfaces/database.interface';

@Injectable()
export class TenantsService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async getTenants(query: GetTenantsQueryDto) {
    const { page, limit, offset, isRenting, keyword } = query;

    const fromClause =
      isRenting === undefined
        ? tenants
        : isRenting
          ? rentingTenants
          : nonRentingTenants;

    const whereClause = keyword
      ? or(
          ilike(fromClause.name, `%${keyword}%`),
          ilike(fromClause.phone, `%${keyword}%`),
          ilike(fromClause.lineId, `%${keyword}%`),
          ilike(fromClause.note, `%${keyword}%`),
        )
      : undefined;

    const [result, total] = await Promise.all([
      this.db
        .select({
          tenantId: fromClause.tenantId,
          name: fromClause.name,
          phone: fromClause.phone,
          lineId: fromClause.lineId,
        })
        .from(fromClause)
        .where(whereClause)
        .orderBy(desc(fromClause.updatedAt), asc(fromClause.tenantId))
        .limit(limit)
        .offset(offset),
      this.db.select({ total: count() }).from(fromClause).where(whereClause),
    ]);

    return {
      tenants: result,
      pagination: new PaginationMetaDto(page, limit, total[0].total),
    };
  }

  async getTenantById(tenantId: string) {
    const tenant = await this.db.query.tenants.findFirst({
      where: eq(tenants.tenantId, tenantId),
    });

    if (!tenant) {
      throw NotFound('tenant');
    }

    return tenant;
  }

  async createTenant(tenant: typeof tenants.$inferInsert) {
    const { phone, lineId } = tenant;

    await this.validateTenantUniqueFields({ phone, lineId });

    const createdTenant = await this.db
      .insert(tenants)
      .values(tenant)
      .returning();

    return createdTenant[0];
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

    const conditions: (SQL | undefined)[] = [];
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

    if (phone) {
      conditions.push(eq(tenants.phone, phone));
    }

    if (lineId) {
      conditions.push(eq(tenants.lineId, lineId));
    }

    const whereClause = excludeTenantId
      ? and(ne(tenants.tenantId, excludeTenantId), or(...conditions))
      : or(...conditions);

    const existingTenants = await this.db.query.tenants.findMany({
      where: whereClause,
    });

    const conflicts = uniqueFields.filter(
      ({ key, value }) =>
        value && existingTenants.some((tenant) => tenant[key] === value),
    );

    if (conflicts.length > 0) {
      const fields = conflicts.map((item) => item.field);

      throw AlreadyExists(...fields);
    }
  }
}
