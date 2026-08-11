import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  isNull,
  ne,
  or,
  SQL,
} from 'drizzle-orm';
import { concat } from 'drizzle-orm/pg-core/expressions';
import { BrandsService } from './brands/brands.service';
import { GetVehiclesQueryDto } from './dto/get-vehicles-query.dto';
import { TypesService } from './types/types.service';
import { PaginationMetaDto } from '../common/dto/pagination-meta.dto';
import { AlreadyExists, NotFound, Required } from '../common/errors/throw';
import DATABASE_CONNECTION from '../database/database-connection';
import { vehicles } from '../database/database.schemas';
import type Database from '../database/types/database';
import { ProvincesService } from '../provinces/provinces.service';
import { TenantsService } from '../tenants/tenants.service';

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: Database,
    private tenantsService: TenantsService,
    private provincesService: ProvincesService,
    private typesService: TypesService,
    private brandsService: BrandsService,
  ) {}

  async getVehicles(query: GetVehiclesQueryDto) {
    const conditions: (SQL | undefined)[] = [];

    if (query.keyword) {
      conditions.push(
        or(
          ilike(
            concat(vehicles.licensePlatePrefix, vehicles.licensePlateNumber),
            `%${query.keyword}%`,
          ),
          ilike(vehicles.note, `%${query.keyword}%`),
        ),
      );
    }

    if (query.provinceIds) {
      conditions.push(inArray(vehicles.provinceId, query.provinceIds));
    }

    if (query.vehicleTypeIds) {
      conditions.push(inArray(vehicles.vehicleTypeId, query.vehicleTypeIds));
    }

    const vehicleBrandIdsConditions: (SQL | undefined)[] = [];

    if (query.vehicleBrandIds) {
      vehicleBrandIdsConditions.push(
        inArray(vehicles.vehicleBrandId, query.vehicleBrandIds),
      );
    }

    if (query.includeNullBrand) {
      vehicleBrandIdsConditions.push(isNull(vehicles.vehicleBrandId));
    }

    if (vehicleBrandIdsConditions.length > 0) {
      conditions.push(or(...vehicleBrandIdsConditions));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [result, total] = await Promise.all([
      this.db.query.vehicles.findMany({
        columns: {
          tenantId: false,
          note: false,
          createdAt: false,
          updatedAt: false,
        },
        where: whereClause,
        with: {
          tenant: {
            columns: {
              tenantId: true,
              name: true,
            },
          },
        },
        orderBy: [desc(vehicles.updatedAt), asc(vehicles.vehicleId)],
        limit: query.limit,
        offset: query.offset,
      }),
      this.db.select({ total: count() }).from(vehicles).where(whereClause),
    ]);

    return {
      vehicles: result,
      pagination: new PaginationMetaDto(
        query.page,
        query.limit,
        total[0].total,
      ),
    };
  }

  async getVehicleById(vehicleId: string) {
    const vehicle = await this.db.query.vehicles.findFirst({
      columns: {
        tenantId: false,
      },
      where: eq(vehicles.vehicleId, vehicleId),
      with: {
        tenant: {
          columns: {
            tenantId: true,
            name: true,
          },
        },
      },
    });

    if (!vehicle) {
      throw NotFound('vehicle');
    }

    return vehicle;
  }

  async createVehicle(vehicle: typeof vehicles.$inferInsert) {
    await this.validateVehicleForeignKeyFields(
      vehicle.tenantId,
      vehicle.provinceId,
      vehicle.vehicleTypeId,
      vehicle.vehicleBrandId,
    );

    await this.validateVehicleUniqueFields(
      vehicle.licensePlatePrefix,
      vehicle.licensePlateNumber,
      vehicle.provinceId,
    );

    const createdVehicle = await this.db.transaction(async (tx) => {
      const createdVehicle = await tx
        .insert(vehicles)
        .values(vehicle)
        .returning({ vehicleId: vehicles.vehicleId });

      return tx.query.vehicles.findFirst({
        columns: {
          tenantId: false,
          updatedAt: false,
        },
        where: eq(vehicles.vehicleId, createdVehicle[0].vehicleId),
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

    return createdVehicle!;
  }

  async updateVehicle(
    vehicleId: string,
    vehicle: Partial<typeof vehicles.$inferInsert>,
  ) {
    if (Object.keys(vehicle).length === 0) {
      throw Required('body');
    }

    await this.validateVehicleForeignKeyFields(
      vehicle.tenantId,
      vehicle.provinceId,
      vehicle.vehicleTypeId,
      vehicle.vehicleBrandId,
    );

    await this.validateVehicleUniqueFields(
      vehicle.licensePlatePrefix,
      vehicle.licensePlateNumber,
      vehicle.provinceId,
      vehicleId,
    );

    const updatedVehicle = await this.db.transaction(async (tx) => {
      const updatedVehicle = await tx
        .update(vehicles)
        .set(vehicle)
        .where(eq(vehicles.vehicleId, vehicleId))
        .returning();

      if (updatedVehicle.length === 0) {
        throw NotFound('vehicle');
      }

      return tx.query.vehicles.findFirst({
        columns: {
          tenantId: false,
          createdAt: false,
        },
        where: eq(vehicles.vehicleId, updatedVehicle[0].vehicleId),
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

    return updatedVehicle!;
  }

  async deleteVehicle(vehicleId: string) {
    const deletedVehicle = await this.db
      .delete(vehicles)
      .where(eq(vehicles.vehicleId, vehicleId))
      .returning();

    if (deletedVehicle.length === 0) {
      throw NotFound('vehicle');
    }
  }

  private async validateVehicleForeignKeyFields(
    tenantId?: string,
    provinceId?: number,
    vehicleTypeId?: number,
    vehicleBrandId?: number | null,
  ) {
    if (!tenantId && !provinceId && !vehicleTypeId && !vehicleBrandId) {
      return;
    }

    const results = await Promise.allSettled([
      tenantId ? this.tenantsService.getTenantById(tenantId) : undefined,
      provinceId
        ? this.provincesService.getProvinceById(provinceId)
        : undefined,
      vehicleTypeId
        ? this.typesService.getVehicleTypeById(vehicleTypeId)
        : undefined,
      vehicleBrandId
        ? this.brandsService.getVehicleBrandById(vehicleBrandId)
        : undefined,
    ]);

    const fields: string[] = [];
    const foreignKeyFields = [
      {
        field: 'tenant',
        value: tenantId,
      },
      {
        field: 'province',
        value: provinceId,
      },
      {
        field: 'vehicleType',
        value: vehicleTypeId,
      },
      {
        field: 'vehicleBrand',
        value: vehicleBrandId,
      },
    ] as const;

    foreignKeyFields.forEach(({ field, value }, index) => {
      if (
        value &&
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

  private async validateVehicleUniqueFields(
    licensePlatePrefix?: string,
    licensePlateNumber?: string,
    provinceId?: number,
    excludeVehicleId?: string,
  ) {
    if (!licensePlatePrefix && !licensePlateNumber && !provinceId) {
      return;
    }

    const conditions: (SQL | undefined)[] = [];
    const uniqueFields = [
      {
        field: 'licensePlatePrefix',
        key: 'licensePlatePrefix',
        value: licensePlatePrefix,
      },
      {
        field: 'licensePlateNumber',
        key: 'licensePlateNumber',
        value: licensePlateNumber,
      },
      {
        field: 'province',
        key: 'provinceId',
        value: provinceId,
      },
    ] as const;

    if (licensePlatePrefix && licensePlateNumber && provinceId) {
      conditions.push(
        and(
          eq(vehicles.licensePlatePrefix, licensePlatePrefix),
          eq(vehicles.licensePlateNumber, licensePlateNumber),
          eq(vehicles.provinceId, provinceId),
        ),
      );
    } else if (excludeVehicleId) {
      const excludeVehicle = await this.db.query.vehicles.findFirst({
        where: eq(vehicles.vehicleId, excludeVehicleId),
      });

      if (!excludeVehicle) {
        throw NotFound('vehicle');
      }

      conditions.push(
        and(
          eq(
            vehicles.licensePlatePrefix,
            licensePlatePrefix ?? excludeVehicle.licensePlatePrefix,
          ),
          eq(
            vehicles.licensePlateNumber,
            licensePlateNumber ?? excludeVehicle.licensePlateNumber,
          ),
          eq(vehicles.provinceId, provinceId ?? excludeVehicle.provinceId),
        ),
      );
    } else {
      const fields = uniqueFields
        .filter(({ value }) => !value)
        .map((field) => field.field);

      throw Required(...fields);
    }

    const whereClause = excludeVehicleId
      ? and(ne(vehicles.vehicleId, excludeVehicleId), or(...conditions))
      : or(...conditions);

    const existingVehicles = await this.db.query.vehicles.findMany({
      where: whereClause,
    });

    const conflicts = uniqueFields.filter(
      ({ key, value }) =>
        value && existingVehicles.some((vehicle) => vehicle[key] === value),
    );

    if (conflicts.length > 0) {
      const fields = conflicts.map((item) => item.field);

      throw AlreadyExists(...fields);
    }
  }
}
