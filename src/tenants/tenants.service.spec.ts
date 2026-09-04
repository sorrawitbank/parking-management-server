import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetTenantsQueryDto } from './dto/get-tenants-query.dto';
import { TenantsService } from './tenants.service';
import DATABASE_CONNECTION from '../database/database-connection';
import {
  nonRentingTenants,
  rentingTenants,
  tenants,
} from '../database/database.schemas';

type Tenants = (typeof tenants.$inferSelect)[];

describe('TenantsService', () => {
  let service: TenantsService;

  const mockTenants = [
    {
      tenantId: 'tenant-1',
      name: 'สมชาย ใจดี',
      phone: '0811111111',
      lineId: 'somchai01',
      note: null,
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
    },
    {
      tenantId: 'tenant-2',
      name: 'สมหญิง รักดี',
      phone: '0822222222',
      lineId: 'som02',
      note: null,
      createdAt: '2026-02-01T10:00:00Z',
      updatedAt: '2026-02-10T15:30:00Z',
    },
    {
      tenantId: 'tenant-3',
      name: 'John Cena',
      phone: '0833333333',
      lineId: 'johnkub',
      note: 'ส่วนใหญ่จ่ายไม่ตรงเวลา',
      createdAt: '2026-03-01T10:00:00Z',
      updatedAt: '2026-03-01T10:00:00Z',
    },
  ] satisfies Tenants;

  const selectMock = jest.fn();
  const insertMock = jest.fn();
  const updateMock = jest.fn();
  const deleteMock = jest.fn();
  const findManyMock = jest.fn();
  const findFirstMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantsService,
        {
          provide: DATABASE_CONNECTION,
          useValue: {
            select: selectMock,
            insert: insertMock,
            update: updateMock,
            delete: deleteMock,
            query: {
              tenants: {
                findMany: findManyMock,
                findFirst: findFirstMock,
              },
            },
          },
        },
      ],
    }).compile();

    service = module.get<TenantsService>(TenantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTenants', () => {
    it('should return tenants with pagination', async () => {
      const offset = jest.fn().mockResolvedValue(mockTenants);
      const limit = jest.fn().mockReturnValue({ offset });
      const orderBy = jest.fn().mockReturnValue({ limit });
      const whereForData = jest.fn().mockReturnValue({ orderBy });
      const fromForData = jest.fn().mockReturnValue({
        where: whereForData,
      });

      const whereForCount = jest
        .fn()
        .mockResolvedValue([{ total: mockTenants.length }]);
      const fromForCount = jest.fn().mockReturnValue({
        where: whereForCount,
      });

      selectMock
        .mockReturnValueOnce({ from: fromForData })
        .mockReturnValueOnce({ from: fromForCount });

      const query: GetTenantsQueryDto = {
        page: 1,
        limit: 10,
        offset: 0,
      };

      const result = await service.getTenants(query);

      expect(result.tenants).toEqual(mockTenants);
      expect(result.pagination).toEqual(
        expect.objectContaining({
          page: 1,
          limit: 10,
          total: mockTenants.length,
        }),
      );
      expect(selectMock).toHaveBeenCalledTimes(2);
      expect(limit).toHaveBeenCalledWith(10);
      expect(offset).toHaveBeenCalledWith(0);
    });

    it('should query tenants when isRenting is undefined', async () => {
      const offset = jest.fn().mockResolvedValue(mockTenants);
      const limit = jest.fn().mockReturnValue({ offset });
      const orderBy = jest.fn().mockReturnValue({ limit });
      const whereForData = jest.fn().mockReturnValue({ orderBy });
      const fromForData = jest.fn().mockReturnValue({
        where: whereForData,
      });

      const whereForCount = jest
        .fn()
        .mockResolvedValue([{ total: mockTenants.length }]);
      const fromForCount = jest.fn().mockReturnValue({
        where: whereForCount,
      });

      selectMock
        .mockReturnValueOnce({ from: fromForData })
        .mockReturnValueOnce({ from: fromForCount });

      const query: GetTenantsQueryDto = {
        page: 1,
        limit: 10,
        offset: 0,
        isRenting: undefined,
      };

      await service.getTenants(query);

      expect(fromForData).toHaveBeenCalledWith(tenants);
      expect(fromForCount).toHaveBeenCalledWith(tenants);
    });

    it('should query rentingTenants when isRenting is true', async () => {
      const offset = jest.fn().mockResolvedValue(mockTenants);
      const limit = jest.fn().mockReturnValue({ offset });
      const orderBy = jest.fn().mockReturnValue({ limit });
      const whereForData = jest.fn().mockReturnValue({ orderBy });
      const fromForData = jest.fn().mockReturnValue({
        where: whereForData,
      });

      const whereForCount = jest
        .fn()
        .mockResolvedValue([{ total: mockTenants.length }]);
      const fromForCount = jest.fn().mockReturnValue({
        where: whereForCount,
      });

      selectMock
        .mockReturnValueOnce({ from: fromForData })
        .mockReturnValueOnce({ from: fromForCount });

      const query: GetTenantsQueryDto = {
        page: 1,
        limit: 10,
        offset: 0,
        isRenting: true,
      };

      await service.getTenants(query);

      expect(fromForData).toHaveBeenCalledWith(rentingTenants);
      expect(fromForCount).toHaveBeenCalledWith(rentingTenants);
    });

    it('should query nonRentingTenants when isRenting is false', async () => {
      const offset = jest.fn().mockResolvedValue(mockTenants);
      const limit = jest.fn().mockReturnValue({ offset });
      const orderBy = jest.fn().mockReturnValue({ limit });
      const whereForData = jest.fn().mockReturnValue({ orderBy });
      const fromForData = jest.fn().mockReturnValue({
        where: whereForData,
      });

      const whereForCount = jest
        .fn()
        .mockResolvedValue([{ total: mockTenants.length }]);
      const fromForCount = jest.fn().mockReturnValue({
        where: whereForCount,
      });

      selectMock
        .mockReturnValueOnce({ from: fromForData })
        .mockReturnValueOnce({ from: fromForCount });

      const query: GetTenantsQueryDto = {
        page: 1,
        limit: 10,
        offset: 0,
        isRenting: false,
      };

      await service.getTenants(query);

      expect(fromForData).toHaveBeenCalledWith(nonRentingTenants);
      expect(fromForCount).toHaveBeenCalledWith(nonRentingTenants);
    });

    it('should query tenants with undefined where clause when keyword is empty', async () => {
      const offset = jest.fn().mockResolvedValue(mockTenants);
      const limit = jest.fn().mockReturnValue({ offset });
      const orderBy = jest.fn().mockReturnValue({ limit });
      const whereForData = jest.fn().mockReturnValue({ orderBy });
      const fromForData = jest.fn().mockReturnValue({
        where: whereForData,
      });

      const whereForCount = jest
        .fn()
        .mockResolvedValue([{ total: mockTenants.length }]);
      const fromForCount = jest.fn().mockReturnValue({
        where: whereForCount,
      });

      selectMock
        .mockReturnValueOnce({ from: fromForData })
        .mockReturnValueOnce({ from: fromForCount });

      const query: GetTenantsQueryDto = {
        page: 1,
        limit: 10,
        offset: 0,
        keyword: '',
      };

      await service.getTenants(query);

      expect(whereForData).toHaveBeenCalledWith(undefined);
      expect(whereForCount).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getTenantById', () => {
    it('should return tenant when tenant exists', async () => {
      findFirstMock.mockResolvedValue(mockTenants[0]);

      const result = await service.getTenantById('tenant-1');

      expect(result).toEqual(mockTenants[0]);
      expect(findFirstMock).toHaveBeenCalledTimes(1);
      expect(findFirstMock).toHaveBeenCalledWith({ where: expect.anything() });
    });

    it('should throw NotFoundException when tenant does not exist', async () => {
      findFirstMock.mockResolvedValue(undefined);

      try {
        await service.getTenantById('not-found');
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
  });

  describe('createTenant', () => {
    it('should create and return a tenant', async () => {
      const input = {
        name: 'John Doe',
        phone: '0812345678',
        lineId: null,
        note: null,
      } satisfies typeof tenants.$inferInsert;

      const createdTenant = {
        tenantId: 'tenant-4',
        ...input,
      };

      findManyMock.mockResolvedValue(
        mockTenants.filter(
          (t) => t.phone === input.phone || t.lineId === input.lineId,
        ),
      );

      const returning = jest.fn().mockResolvedValue([createdTenant]);
      const values = jest.fn().mockReturnValue({ returning });

      insertMock.mockReturnValue({ values });

      const result = await service.createTenant(input);

      expect(result).toEqual(createdTenant);
      expect(findManyMock).toHaveBeenCalledTimes(1);
      expect(insertMock).toHaveBeenCalledWith(tenants);
      expect(values).toHaveBeenCalledWith(input);
    });

    it('should throw ConflictException when phone already exists', async () => {
      const input = {
        name: 'John Doe',
        phone: '0811111111',
        lineId: null,
        note: null,
      } satisfies typeof tenants.$inferInsert;

      findManyMock.mockResolvedValue(
        mockTenants.filter(
          (t) => t.phone === input.phone || t.lineId === input.lineId,
        ),
      );

      try {
        await service.createTenant(input);
        expect(insertMock).not.toHaveBeenCalled();
      } catch (error) {
        expect(findManyMock).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(ConflictException);
        expect((error as ConflictException).getResponse()).toEqual({
          messages: ['PHONE_ALREADY_EXISTS'],
          fields: {
            phone: 'ALREADY_EXISTS',
          },
        });
      }
    });

    it('should throw ConflictException when lineId already exists', async () => {
      const input = {
        name: 'John Doe',
        phone: '0812345678',
        lineId: 'johnkub',
        note: null,
      } satisfies typeof tenants.$inferInsert;

      findManyMock.mockResolvedValue(
        mockTenants.filter(
          (t) => t.phone === input.phone || t.lineId === input.lineId,
        ),
      );

      try {
        await service.createTenant(input);
        expect(insertMock).not.toHaveBeenCalled();
      } catch (error) {
        expect(findManyMock).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(ConflictException);
        expect((error as ConflictException).getResponse()).toEqual({
          messages: ['LINE_ID_ALREADY_EXISTS'],
          fields: {
            lineId: 'ALREADY_EXISTS',
          },
        });
      }
    });

    it('should throw ConflictException when both phone and lineId already exist', async () => {
      const input = {
        name: 'John Doe',
        phone: '0811111111',
        lineId: 'johnkub',
        note: null,
      } satisfies typeof tenants.$inferInsert;

      findManyMock.mockResolvedValue(
        mockTenants.filter(
          (t) => t.phone === input.phone || t.lineId === input.lineId,
        ),
      );

      try {
        await service.createTenant(input);
        expect(insertMock).not.toHaveBeenCalled();
        expect(findManyMock).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect((error as ConflictException).getResponse()).toEqual({
          messages: ['PHONE_ALREADY_EXISTS', 'LINE_ID_ALREADY_EXISTS'],
          fields: {
            phone: 'ALREADY_EXISTS',
            lineId: 'ALREADY_EXISTS',
          },
        });
      }
    });

    it('should skip unique validation when phone and lineId are not provide', async () => {
      const input = {
        name: 'John Doe',
      } satisfies typeof tenants.$inferInsert;

      const createdTenant = {
        tenantId: 'tenant-4',
        ...input,
      };

      const returning = jest.fn().mockResolvedValue([createdTenant]);
      const values = jest.fn().mockReturnValue({ returning });

      insertMock.mockReturnValue({ values });

      await service.createTenant(input);

      expect(findManyMock).not.toHaveBeenCalled();
    });
  });

  describe('updateTenant', () => {
    it('should update and return tenant', async () => {
      const tenantId = 'tenant-1';

      const input = {
        name: 'สมชาย ใจร้าย',
        phone: '0899999999',
        lineId: 'a',
      } satisfies Partial<typeof tenants.$inferInsert>;

      const updatedTenant = {
        tenantId,
        ...input,
      };

      findManyMock.mockResolvedValue(
        mockTenants.filter(
          (t) =>
            t.tenantId !== tenantId &&
            (t.phone === input.phone || t.lineId === input.lineId),
        ),
      );

      const returning = jest.fn().mockResolvedValueOnce([updatedTenant]);
      const where = jest.fn().mockReturnValue({ returning });
      const set = jest.fn().mockReturnValue({ where });

      updateMock.mockReturnValue({ set });

      const result = await service.updateTenant(tenantId, input);

      expect(result).toEqual(updatedTenant);
      expect(updateMock).toHaveBeenCalledWith(tenants);
      expect(set).toHaveBeenCalledWith(input);
    });

    it('should throw BadRequestException when no fields to update', async () => {
      const tenantId = 'tenant-1';

      const input = {} satisfies Partial<typeof tenants.$inferInsert>;

      try {
        await service.updateTenant(tenantId, input);
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

    it('should throw NotFoundException when tenant does not exist', async () => {
      const input = {
        name: 'สมชาย ใจร้าย',
      } satisfies Partial<typeof tenants.$inferInsert>;

      const returning = jest.fn().mockResolvedValue([]);
      const where = jest.fn().mockReturnValue({ returning });
      const set = jest.fn().mockReturnValue({ where });

      updateMock.mockReturnValue({ set });

      try {
        await service.updateTenant('not-found', input);
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

    it('should throw ConflictException when phone already exists', async () => {
      const tenantId = 'tenant-1';

      const input = {
        phone: '0822222222',
        lineId: null,
      } satisfies Partial<typeof tenants.$inferInsert>;

      findManyMock.mockResolvedValue(
        mockTenants.filter(
          (t) =>
            t.tenantId !== tenantId &&
            (t.phone === input.phone || t.lineId === input.lineId),
        ),
      );

      try {
        await service.updateTenant(tenantId, input);
        expect(updateMock).not.toHaveBeenCalled();
      } catch (error) {
        expect(findManyMock).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(ConflictException);
        expect((error as ConflictException).getResponse()).toEqual({
          messages: ['PHONE_ALREADY_EXISTS'],
          fields: {
            phone: 'ALREADY_EXISTS',
          },
        });
      }
    });

    it('should throw ConflictException when lineId already exists', async () => {
      const tenantId = 'tenant-1';

      const input = {
        phone: null,
        lineId: 'som02',
      } satisfies Partial<typeof tenants.$inferInsert>;

      findManyMock.mockResolvedValue(
        mockTenants.filter(
          (t) =>
            t.tenantId !== tenantId &&
            (t.phone === input.phone || t.lineId === input.lineId),
        ),
      );

      try {
        await service.updateTenant(tenantId, input);
        expect(updateMock).not.toHaveBeenCalled();
      } catch (error) {
        expect(findManyMock).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(ConflictException);
        expect((error as ConflictException).getResponse()).toEqual({
          messages: ['LINE_ID_ALREADY_EXISTS'],
          fields: {
            lineId: 'ALREADY_EXISTS',
          },
        });
      }
    });

    it('should throw ConflictException when both phone and lineId already exist', async () => {
      const tenantId = 'tenant-1';

      const input = {
        phone: '0822222222',
        lineId: 'som02',
      } satisfies Partial<typeof tenants.$inferInsert>;

      findManyMock.mockResolvedValue(
        mockTenants.filter(
          (t) =>
            t.tenantId !== tenantId &&
            (t.phone === input.phone || t.lineId === input.lineId),
        ),
      );

      try {
        await service.updateTenant(tenantId, input);
        expect(updateMock).not.toHaveBeenCalled();
      } catch (error) {
        expect(findManyMock).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(ConflictException);
        expect((error as ConflictException).getResponse()).toEqual({
          messages: ['PHONE_ALREADY_EXISTS', 'LINE_ID_ALREADY_EXISTS'],
          fields: {
            phone: 'ALREADY_EXISTS',
            lineId: 'ALREADY_EXISTS',
          },
        });
      }
    });

    it('should skip unique validation when phone and lineId are not provide', async () => {
      const tenantId = 'tenant-1';

      const input = {
        name: 'สมชาย ใจร้าย',
      } satisfies Partial<typeof tenants.$inferInsert>;

      const updatedTenant = {
        tenantId,
        ...input,
      };

      const returning = jest.fn().mockResolvedValueOnce([updatedTenant]);
      const where = jest.fn().mockReturnValue({ returning });
      const set = jest.fn().mockReturnValue({ where });

      updateMock.mockReturnValue({ set });

      await service.updateTenant(tenantId, input);

      expect(findManyMock).not.toHaveBeenCalled();
    });
  });

  describe('deleteTenant', () => {
    it('should delete tenant', async () => {
      const deletedTenant = mockTenants[0];

      const returning = jest.fn().mockResolvedValue([deletedTenant]);
      const where = jest.fn().mockReturnValue({ returning });

      deleteMock.mockReturnValue({ where });

      await expect(
        service.deleteTenant(deletedTenant.tenantId),
      ).resolves.toBeUndefined();
      expect(deleteMock).toHaveBeenCalledWith(tenants);
    });

    it('should throw NotFoundException when tenant does not exist', async () => {
      const returning = jest.fn().mockResolvedValue([]);
      const where = jest.fn().mockReturnValue({ returning });

      deleteMock.mockReturnValue({ where });

      try {
        await service.deleteTenant('not-found');
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
  });
});
