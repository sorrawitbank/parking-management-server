import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, operators } from 'drizzle-orm';
import { concat } from 'drizzle-orm/pg-core/expressions';
import { BrandsService } from './brands/brands.service';
import { GetVehiclesQueryDto } from './dto/get-vehicles-query.dto';
import { TypesService } from './types/types.service';
import { ProvincesService } from '../provinces/provinces.service';
import { TenantsService } from '../tenants/tenants.service';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';
import { AlreadyExists, NotFound, Required } from '../../common/errors/throw';
import { DATABASE_CONNECTION } from '../../database/database.constants';
import { vehicles } from '../../database/database.schemas';
import { FindManyWhere, type Database } from '../../database/interfaces';

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
    const { page, limit, offset, ...conditions } = query;

    const rawWhereClause: FindManyWhere<'vehicles'>['RAW'] = Object.values(
      conditions,
    ).some((value) => value !== undefined)
      ? (table, { and, ilike, inArray, isNull, or }) => {
          const {
            provinceIds,
            vehicleTypeIds,
            vehicleBrandIds,
            includeNullBrand,
            keyword,
          } = conditions;

          return and(
            provinceIds ? inArray(table.provinceId, provinceIds) : undefined,
            vehicleTypeIds
              ? inArray(table.vehicleTypeId, vehicleTypeIds)
              : undefined,
            vehicleBrandIds || includeNullBrand
              ? or(
                  vehicleBrandIds
                    ? inArray(table.vehicleBrandId, vehicleBrandIds)
                    : undefined,
                  includeNullBrand ? isNull(table.vehicleBrandId) : undefined,
                )
              : undefined,
            keyword
              ? or(
                  ilike(
                    concat(table.licensePlatePrefix, table.licensePlateNumber),
                    `%${keyword}%`,
                  ),
                  ilike(table.note, `%${keyword}%`),
                )
              : undefined,
          )!;
        }
      : undefined;

    const [result, total] = await Promise.all([
      this.db.query.vehicles.findMany({
        columns: {
          tenantId: false,
          note: false,
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
          vehicleId: 'asc',
        },
        limit,
        offset,
      }),
      this.db.$count(
        vehicles,
        rawWhereClause && rawWhereClause(vehicles, operators),
      ),
    ]);

    return {
      vehicles: result,
      pagination: new PaginationMetaDto(page, limit, total),
    };
  }

  async getVehicleById(vehicleId: string) {
    const vehicle = await this.db.query.vehicles.findFirst({
      columns: {
        tenantId: false,
      },
      where: {
        vehicleId: { eq: vehicleId },
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

    if (!vehicle) {
      throw NotFound('vehicle');
    }

    return vehicle;
  }

  async createVehicle(vehicle: typeof vehicles.$inferInsert) {
    const {
      tenantId,
      licensePlatePrefix,
      licensePlateNumber,
      provinceId,
      vehicleTypeId,
      vehicleBrandId,
    } = vehicle;

    await this.validateVehicleForeignKeyFields({
      tenantId,
      provinceId,
      vehicleTypeId,
      vehicleBrandId,
    });

    await this.validateVehicleUniqueFields({
      licensePlatePrefix,
      licensePlateNumber,
      provinceId,
    });

    const createdVehicle = await this.db.transaction(async (tx) => {
      const [createdVehicle] = await tx
        .insert(vehicles)
        .values(vehicle)
        .returning({ vehicleId: vehicles.vehicleId });

      return tx.query.vehicles.findFirst({
        columns: {
          tenantId: false,
          updatedAt: false,
        },
        where: {
          vehicleId: { eq: createdVehicle.vehicleId },
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

    return createdVehicle!;
  }

  async updateVehicle(
    vehicleId: string,
    vehicle: Partial<typeof vehicles.$inferInsert>,
  ) {
    if (Object.keys(vehicle).length === 0) {
      throw Required('body');
    }

    const {
      tenantId,
      licensePlatePrefix,
      licensePlateNumber,
      provinceId,
      vehicleTypeId,
      vehicleBrandId,
    } = vehicle;

    await this.validateVehicleForeignKeyFields({
      tenantId,
      provinceId,
      vehicleTypeId,
      vehicleBrandId,
    });

    await this.validateVehicleUniqueFields({
      licensePlatePrefix,
      licensePlateNumber,
      provinceId,
      excludeVehicleId: vehicleId,
    });

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
        where: {
          vehicleId: { eq: updatedVehicle[0].vehicleId },
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
    params: ValidateVehicleForeignKeyFieldsParams,
  ) {
    const { tenantId, provinceId, vehicleTypeId, vehicleBrandId } = params;

    if (!tenantId && !provinceId && !vehicleTypeId && !vehicleBrandId) {
      return;
    }

    const results = await Promise.allSettled([
      tenantId ? this.tenantsService.ensureTenantExists(tenantId) : undefined,
      provinceId
        ? this.provincesService.ensureProvinceExists(provinceId)
        : undefined,
      vehicleTypeId
        ? this.typesService.ensureVehicleTypeExists(vehicleTypeId)
        : undefined,
      vehicleBrandId
        ? this.brandsService.ensureVehicleBrandExists(vehicleBrandId)
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

  private async validateVehicleUniqueFields(
    params: ValidateVehicleUniqueFieldsParams,
  ) {
    const {
      licensePlatePrefix,
      licensePlateNumber,
      provinceId,
      excludeVehicleId,
    } = params;

    if (!licensePlatePrefix && !licensePlateNumber && !provinceId) {
      return;
    }

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

    const whereClause: FindManyWhere<'vehicles'>['AND'] = [];

    if (licensePlatePrefix && licensePlateNumber && provinceId) {
      whereClause.push(
        { licensePlatePrefix: { eq: licensePlatePrefix } },
        { licensePlateNumber: { eq: licensePlateNumber } },
        { provinceId: { eq: provinceId } },
      );
    } else if (excludeVehicleId) {
      const excludeVehicle = await this.db.query.vehicles.findFirst({
        columns: {
          licensePlatePrefix: true,
          licensePlateNumber: true,
          provinceId: true,
        },
        where: {
          vehicleId: { eq: excludeVehicleId },
        },
      });

      if (!excludeVehicle) {
        throw NotFound('vehicle');
      }

      whereClause.push({
        licensePlatePrefix: {
          eq: licensePlatePrefix ?? excludeVehicle.licensePlatePrefix,
        },
        licensePlateNumber: {
          eq: licensePlateNumber ?? excludeVehicle.licensePlateNumber,
        },
        provinceId: {
          eq: provinceId ?? excludeVehicle.provinceId,
        },
      });
    } else {
      const fields = uniqueFields
        .filter(({ value }) => value == null)
        .map((field) => field.field);

      throw Required(...fields);
    }

    const existingVehicles = await this.db.query.vehicles.findMany({
      where: {
        AND: [{ vehicleId: { ne: excludeVehicleId } }, ...whereClause],
      },
    });

    const conflicts = uniqueFields.filter(
      ({ key, value }) =>
        value != null &&
        existingVehicles.some((vehicle) => vehicle[key] === value),
    );

    if (conflicts.length > 0) {
      const fields = conflicts.map((item) => item.field);

      throw AlreadyExists(...fields);
    }
  }
}
