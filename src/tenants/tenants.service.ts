import {
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, count, eq, ilike, ne, or, SQL } from 'drizzle-orm';
import { GetTenantsQueryDto } from './dto/get-tenants-query.dto';
import { PaginationMetaDto } from '../common/dto/pagination-meta.dto';
import DATABASE_CONNECTION from '../database/database-connection';
import { rentingTenants, tenants } from '../database/database.schemas';
import type Database from '../database/types/database';
import formatArray from '../utils/format-array';

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

    if (!updatedTenant.length) {
      throw new NotFoundException('Tenant Not Found');
    }

    return updatedTenant[0];
  }

  async deleteTenant(tenantId: string) {
    const deletedTenant = await this.db
      .delete(tenants)
      .where(eq(tenants.tenantId, tenantId))
      .returning();

    if (!deletedTenant.length) {
      throw new NotFoundException('Tenant Not Found');
    }
  }

  private async validateTenantUniqueFields(
    phone?: string | null,
    lineId?: string | null,
    excludeTenantId?: string,
  ) {
    const conditions: SQL[] = [];

    if (phone) {
      conditions.push(eq(tenants.phone, phone));
    }

    if (lineId) {
      conditions.push(eq(tenants.lineId, lineId));
    }

    if (conditions.length === 0) {
      return;
    }

    const whereClause = and(
      or(...conditions),
      excludeTenantId ? ne(tenants.tenantId, excludeTenantId) : undefined,
    );

    const existingTenants = await this.db.query.tenants.findMany({
      where: whereClause,
    });

    const uniqueFields = [
      {
        field: 'phone',
        label: 'Phone number',
        value: phone,
      },
      {
        field: 'lineId',
        label: 'Line ID',
        value: lineId,
      },
    ] as const;

    const conflicts = uniqueFields.filter(
      ({ field, value }) =>
        value && existingTenants.some((tenant) => tenant[field] === value),
    );

    if (conflicts.length > 0) {
      const fields = conflicts.map((item) => item.field);
      const labels = conflicts.map((item) => item.label);

      throw new ConflictException({
        message: `${formatArray(labels)} already ${
          labels.length === 1 ? 'exists' : 'exist'
        }`,
        fields,
        error: 'Conflict',
        statusCode: HttpStatus.CONFLICT,
      });
    }
  }
}
