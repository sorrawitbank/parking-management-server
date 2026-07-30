import { Inject, Injectable } from '@nestjs/common';
import { and, asc, count, desc, eq, ilike, ne, or, SQL } from 'drizzle-orm';
import { GetTenantsQueryDto } from './dto/get-tenants-query.dto';
import { PaginationMetaDto } from '../common/dto/pagination-meta.dto';
import { AlreadyExists, NotFound, Required } from '../common/errors/throw';
import DATABASE_CONNECTION from '../database/database-connection';
import { rentingTenants, tenants } from '../database/database.schemas';
import type Database from '../database/types/database';

@Injectable()
export class TenantsService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async getTenants(query: GetTenantsQueryDto) {
    const fromClause = query.isRenting ? rentingTenants : tenants;

    const whereClause = query.keyword
      ? or(
          ilike(fromClause.name, `%${query.keyword}%`),
          ilike(fromClause.phone, `%${query.keyword}%`),
          ilike(fromClause.lineId, `%${query.keyword}%`),
          ilike(fromClause.note, `%${query.keyword}%`),
        )
      : undefined;

    const [result, total] = await Promise.all([
      this.db
        .select()
        .from(fromClause)
        .where(whereClause)
        .orderBy(desc(fromClause.updatedAt), asc(fromClause.tenantId))
        .limit(query.limit)
        .offset(query.offset),
      this.db.select({ total: count() }).from(fromClause).where(whereClause),
    ]);

    return {
      tenants: result,
      pagination: new PaginationMetaDto(
        query.page,
        query.limit,
        total[0].total,
      ),
    };
  }

  async createTenant(tenant: typeof tenants.$inferInsert) {
    await this.validateTenantUniqueFields(tenant.phone, tenant.lineId);

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

    await this.validateTenantUniqueFields(
      tenant.phone,
      tenant.lineId,
      tenantId,
    );

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
    phone?: string | null,
    lineId?: string | null,
    excludeTenantId?: string,
  ) {
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

      throw AlreadyExists(fields);
    }
  }
}
