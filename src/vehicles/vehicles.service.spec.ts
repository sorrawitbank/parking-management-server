import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BrandsService } from './brands/brands.service';
import { GetVehiclesQueryDto } from './dto/get-vehicles-query.dto';
import { TypesService } from './types/types.service';
import { VehiclesService } from './vehicles.service';
import { NotFound } from '../common/errors/throw';
import DATABASE_CONNECTION from '../database/database-connection';
import { vehicles } from '../database/database.schemas';
import { ProvincesService } from '../provinces/provinces.service';
import { TenantsService } from '../tenants/tenants.service';

type Vehicles = (typeof vehicles.$inferSelect)[];

describe('VehiclesService', () => {
  let service: VehiclesService;
  let tenantsService: jest.Mocked<TenantsService>;
  let provincesService: jest.Mocked<ProvincesService>;
  let typesService: jest.Mocked<TypesService>;
  let brandsService: jest.Mocked<BrandsService>;

  const mockVehicles = [
    {
      vehicleId: 'vehicle-1',
      licensePlatePrefix: 'กข',
      licensePlateNumber: '1000',
      tenantId: 'tenant-1',
      provinceId: 10,
      vehicleTypeId: 1,
      vehicleBrandId: 1,
      note: 'รถคันนี้สีแดง',
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
    },
    {
      vehicleId: 'vehicle-2',
      licensePlatePrefix: 'กค',
      licensePlateNumber: '1000',
      tenantId: 'tenant-1',
      provinceId: 10,
      vehicleTypeId: 2,
      vehicleBrandId: 1,
      note: null,
      createdAt: '2026-02-01T10:00:00Z',
      updatedAt: '2026-02-10T15:30:00Z',
    },
    {
      vehicleId: 'vehicle-3',
      licensePlatePrefix: 'กง',
      licensePlateNumber: '1000',
      tenantId: 'tenant-2',
      provinceId: 50,
      vehicleTypeId: 1,
      vehicleBrandId: 2,
      note: null,
      createdAt: '2026-02-01T10:00:00Z',
      updatedAt: '2026-02-10T15:30:00Z',
    },
  ] satisfies Vehicles;

  const selectMock = jest.fn();
  const deleteMock = jest.fn();
  const transactionMock = jest.fn();
  const findManyMock = jest.fn();
  const findFirstMock = jest.fn();

  const getTenantByIdMock = jest.fn();
  const getProvinceByIdMock = jest.fn();
  const getVehicleTypeByIdMock = jest.fn();
  const getVehicleBrandByIdMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: DATABASE_CONNECTION,
          useValue: {
            select: selectMock,
            delete: deleteMock,
            transaction: transactionMock,
            query: {
              vehicles: {
                findMany: findManyMock,
                findFirst: findFirstMock,
              },
            },
          },
        },
        {
          provide: TenantsService,
          useValue: {
            getTenantById: getTenantByIdMock,
          },
        },
        {
          provide: ProvincesService,
          useValue: {
            getProvinceById: getProvinceByIdMock,
          },
        },
        {
          provide: TypesService,
          useValue: {
            getVehicleTypeById: getVehicleTypeByIdMock,
          },
        },
        {
          provide: BrandsService,
          useValue: {
            getVehicleBrandById: getVehicleBrandByIdMock,
          },
        },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    tenantsService = module.get(TenantsService);
    provincesService = module.get(ProvincesService);
    typesService = module.get(TypesService);
    brandsService = module.get(BrandsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getVehicles', () => {
    it('should return vehicles with pagination', async () => {
      const whereForCount = jest
        .fn()
        .mockResolvedValue([{ total: mockVehicles.length }]);
      const fromForCount = jest.fn().mockReturnValue({
        where: whereForCount,
      });

      findManyMock.mockResolvedValue(mockVehicles);
      selectMock.mockReturnValueOnce({ from: fromForCount });

      const query: GetVehiclesQueryDto = {
        page: 1,
        limit: 10,
        offset: 0,
      };

      const result = await service.getVehicles(query);

      expect(result.vehicles).toEqual(mockVehicles);
      expect(result.pagination).toEqual(
        expect.objectContaining({
          page: 1,
          limit: 10,
          total: mockVehicles.length,
        }),
      );
      expect(selectMock).toHaveBeenCalledTimes(1);
      expect(findManyMock).toHaveBeenCalledTimes(1);
      expect(findManyMock).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 0,
        }),
      );
      expect(fromForCount).toHaveBeenCalledWith(vehicles);
    });

    it('should query vehicles with where clause when some query params are provided', async () => {
      const whereForCount = jest
        .fn()
        .mockResolvedValue([{ total: mockVehicles.length }]);
      const fromForCount = jest.fn().mockReturnValue({
        where: whereForCount,
      });

      findManyMock.mockResolvedValue(mockVehicles);
      selectMock.mockReturnValueOnce({ from: fromForCount });

      const query: GetVehiclesQueryDto = {
        page: 1,
        limit: 10,
        offset: 0,
        provinceIds: [10],
      };

      await service.getVehicles(query);

      expect(findManyMock).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.anything() }),
      );
      expect(whereForCount).toHaveBeenCalledWith(expect.anything());
    });

    it('should query vehicles with undefined where clause when no query params are provided', async () => {
      const whereForCount = jest
        .fn()
        .mockResolvedValue([{ total: mockVehicles.length }]);
      const fromForCount = jest.fn().mockReturnValue({
        where: whereForCount,
      });

      findManyMock.mockResolvedValue(mockVehicles);
      selectMock.mockReturnValueOnce({ from: fromForCount });

      const query: GetVehiclesQueryDto = {
        page: 1,
        limit: 10,
        offset: 0,
      };

      await service.getVehicles(query);

      expect(findManyMock).toHaveBeenCalledWith(
        expect.objectContaining({ where: undefined }),
      );
      expect(whereForCount).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getVehicleById', () => {
    it('should return vehicle when tenant exists', async () => {
      findFirstMock.mockResolvedValue(mockVehicles[0]);

      const result = await service.getVehicleById('vehicle-1');

      expect(result).toEqual(mockVehicles[0]);
      expect(findFirstMock).toHaveBeenCalledTimes(1);
      expect(findFirstMock).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.anything() }),
      );
    });

    it('should throw NotFoundException when vehicle does not exist', async () => {
      findFirstMock.mockResolvedValue(undefined);

      try {
        await service.getVehicleById('not-found');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as NotFoundException).getResponse()).toEqual({
          messages: ['VEHICLE_NOT_FOUND'],
          fields: {
            vehicle: 'NOT_FOUND',
          },
        });
      }
    });
  });

  describe('createVehicle', () => {
    it('should create and return a vehicle', async () => {
      const input = {
        licensePlatePrefix: 'กจ',
        licensePlateNumber: '1000',
        tenantId: 'tenant-1',
        provinceId: 10,
        vehicleTypeId: 1,
        vehicleBrandId: 1,
        note: null,
      } satisfies typeof vehicles.$inferInsert;

      const createdVehicle = {
        vehicleId: 'vehicle-4',
        ...input,
      };

      tenantsService.getTenantById.mockResolvedValue({} as never);
      provincesService.getProvinceById.mockResolvedValue({} as never);
      typesService.getVehicleTypeById.mockResolvedValue({} as never);
      brandsService.getVehicleBrandById.mockResolvedValue({} as never);

      findManyMock.mockResolvedValue(
        mockVehicles.filter(
          (v) =>
            v.licensePlatePrefix === input.licensePlatePrefix &&
            v.licensePlateNumber === input.licensePlateNumber &&
            v.provinceId === input.provinceId,
        ),
      );

      const returning = jest.fn().mockResolvedValue([createdVehicle]);
      const values = jest.fn().mockReturnValue({ returning });

      const tx = {
        insert: jest.fn().mockReturnValue({ values }),
        query: {
          vehicles: {
            findFirst: jest.fn().mockResolvedValue(createdVehicle),
          },
        },
      };

      transactionMock.mockImplementation(async (callback) => {
        return callback(tx);
      });

      const result = await service.createVehicle(input);

      expect(result).toEqual(createdVehicle);
      expect(findManyMock).toHaveBeenCalledTimes(1);
      expect(transactionMock).toHaveBeenCalledTimes(1);
      expect(tx.insert).toHaveBeenCalledWith(vehicles);
      expect(values).toHaveBeenCalledWith(input);
    });

    it('should throw NotFoundException when tenant does not exist', async () => {
      const input = {
        licensePlatePrefix: 'กจ',
        licensePlateNumber: '1000',
        tenantId: 'not-found',
        provinceId: 10,
        vehicleTypeId: 1,
        vehicleBrandId: 1,
        note: null,
      } satisfies typeof vehicles.$inferInsert;

      tenantsService.getTenantById.mockRejectedValue(NotFound('tenant'));
      provincesService.getProvinceById.mockResolvedValue({} as never);
      typesService.getVehicleTypeById.mockResolvedValue({} as never);
      brandsService.getVehicleBrandById.mockResolvedValue({} as never);

      try {
        await service.createVehicle(input);
        expect(transactionMock).not.toHaveBeenCalled();
        expect(findManyMock).not.toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as NotFoundException).getResponse()).toEqual({
          messages: ['TENANT_NOT_FOUND'],
          fields: {
            tenant: 'NOT_FOUND',
          },
        });
      }
    });

    it('should throw NotFoundException when province does not exist', async () => {
      const input = {
        licensePlatePrefix: 'กจ',
        licensePlateNumber: '1000',
        tenantId: 'tenant-1',
        provinceId: 99,
        vehicleTypeId: 1,
        vehicleBrandId: 1,
        note: null,
      } satisfies typeof vehicles.$inferInsert;

      tenantsService.getTenantById.mockResolvedValue({} as never);
      provincesService.getProvinceById.mockRejectedValue(NotFound('province'));
      typesService.getVehicleTypeById.mockResolvedValue({} as never);
      brandsService.getVehicleBrandById.mockResolvedValue({} as never);

      try {
        await service.createVehicle(input);
        expect(transactionMock).not.toHaveBeenCalled();
        expect(findManyMock).not.toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as NotFoundException).getResponse()).toEqual({
          messages: ['PROVINCE_NOT_FOUND'],
          fields: {
            province: 'NOT_FOUND',
          },
        });
      }
    });

    it('should throw NotFoundException when type and brand do not exist', async () => {
      const input = {
        licensePlatePrefix: 'กจ',
        licensePlateNumber: '1000',
        tenantId: 'tenant-1',
        provinceId: 99,
        vehicleTypeId: 1,
        vehicleBrandId: 1,
        note: null,
      } satisfies typeof vehicles.$inferInsert;

      tenantsService.getTenantById.mockResolvedValue({} as never);
      provincesService.getProvinceById.mockResolvedValue({} as never);
      typesService.getVehicleTypeById.mockRejectedValue(
        NotFound('vehicleType'),
      );
      brandsService.getVehicleBrandById.mockRejectedValue(
        NotFound('vehicleBrand'),
      );

      try {
        await service.createVehicle(input);
        expect(transactionMock).not.toHaveBeenCalled();
        expect(findManyMock).not.toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as NotFoundException).getResponse()).toEqual({
          messages: ['VEHICLE_TYPE_NOT_FOUND', 'VEHICLE_BRAND_NOT_FOUND'],
          fields: {
            vehicleType: 'NOT_FOUND',
            vehicleBrand: 'NOT_FOUND',
          },
        });
      }
    });

    it('should throw ConflictException when licensePlatePrefix, licensePlateNumber and provinceId already exist', async () => {
      const input = {
        licensePlatePrefix: 'กข',
        licensePlateNumber: '1000',
        tenantId: 'tenant-2',
        provinceId: 10,
        vehicleTypeId: 1,
        vehicleBrandId: 1,
        note: null,
      } satisfies typeof vehicles.$inferInsert;

      tenantsService.getTenantById.mockResolvedValue({} as never);
      provincesService.getProvinceById.mockResolvedValue({} as never);
      typesService.getVehicleTypeById.mockResolvedValue({} as never);
      brandsService.getVehicleBrandById.mockResolvedValue({} as never);

      findManyMock.mockResolvedValue(
        mockVehicles.filter(
          (v) =>
            v.licensePlatePrefix === input.licensePlatePrefix &&
            v.licensePlateNumber === input.licensePlateNumber &&
            v.provinceId === input.provinceId,
        ),
      );

      try {
        await service.createVehicle(input);
        expect(transactionMock).not.toHaveBeenCalled();
        expect(findManyMock).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect((error as ConflictException).getResponse()).toEqual({
          messages: [
            'LICENSE_PLATE_PREFIX_ALREADY_EXISTS',
            'LICENSE_PLATE_NUMBER_ALREADY_EXISTS',
            'PROVINCE_ALREADY_EXISTS',
          ],
          fields: {
            licensePlatePrefix: 'ALREADY_EXISTS',
            licensePlateNumber: 'ALREADY_EXISTS',
            province: 'ALREADY_EXISTS',
          },
        });
      }
    });
  });

  describe('updateVehicle', () => {
    it('should update and return a vehicle', async () => {
      const vehicleId = 'vehicle-1';

      const input = {
        licensePlatePrefix: 'อฮ',
        licensePlateNumber: '1234',
        provinceId: 50,
      } satisfies Partial<typeof vehicles.$inferInsert>;

      const updatedVehicle = {
        vehicleId,
        ...input,
      };

      provincesService.getProvinceById.mockResolvedValue({} as never);

      findManyMock.mockResolvedValue(
        mockVehicles.filter(
          (v) =>
            v.vehicleId !== vehicleId &&
            v.licensePlatePrefix === input.licensePlatePrefix &&
            v.licensePlateNumber === input.licensePlateNumber &&
            v.provinceId === input.provinceId,
        ),
      );

      const returning = jest.fn().mockResolvedValue([updatedVehicle]);
      const where = jest.fn().mockReturnValue({ returning });
      const set = jest.fn().mockReturnValue({ where });

      const tx = {
        update: jest.fn().mockReturnValue({ set }),
        query: {
          vehicles: {
            findFirst: jest.fn().mockResolvedValue(updatedVehicle),
          },
        },
      };

      transactionMock.mockImplementation(async (callback) => {
        return callback(tx);
      });

      const result = await service.updateVehicle(vehicleId, input);

      expect(result).toEqual(updatedVehicle);
      expect(findManyMock).toHaveBeenCalledTimes(1);
      expect(transactionMock).toHaveBeenCalledTimes(1);
      expect(tx.update).toHaveBeenCalledWith(vehicles);
      expect(set).toHaveBeenCalledWith(input);
    });

    it('should throw BadRequestException when no fields to update', async () => {
      const vehicleId = 'vehicle-1';

      const input = {} satisfies Partial<typeof vehicles.$inferInsert>;

      try {
        await service.updateVehicle(vehicleId, input);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect((error as BadRequestException).getResponse()).toEqual({
          messages: ['BODY_REQUIRED'],
          fields: {
            body: 'REQUIRED',
          },
        });
      }
    });

    it('should throw NotFoundException when vehicle does not exist', async () => {
      const input = {
        licensePlatePrefix: 'อฮ',
        licensePlateNumber: '1234',
        provinceId: 50,
      } satisfies Partial<typeof vehicles.$inferInsert>;

      const returning = jest.fn().mockResolvedValue([]);
      const where = jest.fn().mockReturnValue({ returning });
      const set = jest.fn().mockReturnValue({ where });

      const tx = {
        update: jest.fn().mockReturnValue({ set }),
      };

      transactionMock.mockImplementation(async (callback) => {
        return callback(tx);
      });

      try {
        await service.updateVehicle('not-found', input);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as NotFoundException).getResponse()).toEqual({
          messages: ['VEHICLE_NOT_FOUND'],
          fields: {
            vehicle: 'NOT_FOUND',
          },
        });
      }
    });

    it('should throw ConflictException when licensePlatePrefix, licensePlateNumber and provinceId already exist', async () => {
      const vehicleId = 'vehicle-1';

      const input = {
        licensePlatePrefix: 'กง',
        licensePlateNumber: '1000',
        provinceId: 50,
      } satisfies Partial<typeof vehicles.$inferInsert>;

      provincesService.getProvinceById.mockResolvedValue({} as never);

      findManyMock.mockResolvedValue(
        mockVehicles.filter(
          (v) =>
            v.vehicleId !== vehicleId &&
            v.licensePlatePrefix === input.licensePlatePrefix &&
            v.licensePlateNumber === input.licensePlateNumber &&
            v.provinceId === input.provinceId,
        ),
      );

      transactionMock.mockImplementation();

      try {
        await service.updateVehicle(vehicleId, input);
        expect(transactionMock).not.toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect((error as ConflictException).getResponse()).toEqual({
          messages: [
            'LICENSE_PLATE_PREFIX_ALREADY_EXISTS',
            'LICENSE_PLATE_NUMBER_ALREADY_EXISTS',
            'PROVINCE_ALREADY_EXISTS',
          ],
          fields: {
            licensePlatePrefix: 'ALREADY_EXISTS',
            licensePlateNumber: 'ALREADY_EXISTS',
            province: 'ALREADY_EXISTS',
          },
        });
      }
    });

    it('should skip some foreign key validation when some foreign keys are not provided', async () => {
      const vehicleId = 'vehicle-1';

      const input = {
        provinceId: 50,
        vehicleBrandId: 2,
      } satisfies Partial<typeof vehicles.$inferInsert>;

      const updatedVehicle = {
        vehicleId,
        ...input,
      };

      provincesService.getProvinceById.mockResolvedValue({} as never);
      brandsService.getVehicleBrandById.mockResolvedValue({} as never);

      findFirstMock.mockResolvedValue(mockVehicles[0]);
      findManyMock.mockResolvedValue([]);

      const returning = jest.fn().mockResolvedValue([updatedVehicle]);
      const where = jest.fn().mockReturnValue({ returning });
      const set = jest.fn().mockReturnValue({ where });

      const tx = {
        update: jest.fn().mockReturnValue({ set }),
        query: {
          vehicles: {
            findFirst: jest.fn().mockResolvedValue(updatedVehicle),
          },
        },
      };

      transactionMock.mockImplementation(async (callback) => {
        return callback(tx);
      });

      await service.updateVehicle(vehicleId, input);

      expect(tenantsService.getTenantById).not.toHaveBeenCalled();
      expect(provincesService.getProvinceById).toHaveBeenCalledTimes(1);
      expect(typesService.getVehicleTypeById).not.toHaveBeenCalled();
      expect(brandsService.getVehicleBrandById).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteVehicle', () => {
    it('should delete vehicle', async () => {
      const deletedVehicle = mockVehicles[0];

      const returning = jest.fn().mockResolvedValue([deletedVehicle]);
      const where = jest.fn().mockReturnValue({ returning });

      deleteMock.mockReturnValue({ where });

      await expect(
        service.deleteVehicle(deletedVehicle.tenantId),
      ).resolves.toBeUndefined();
      expect(deleteMock).toHaveBeenCalledWith(vehicles);
    });

    it('should throw NotFoundException when vehicle does not exist', async () => {
      const returning = jest.fn().mockResolvedValue([]);
      const where = jest.fn().mockReturnValue({ returning });

      deleteMock.mockReturnValue({ where });

      try {
        await service.deleteVehicle('not-found');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as NotFoundException).getResponse()).toEqual({
          messages: ['VEHICLE_NOT_FOUND'],
          fields: {
            vehicle: 'NOT_FOUND',
          },
        });
      }
    });
  });
});
