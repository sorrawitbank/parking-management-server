import { Test, TestingModule } from '@nestjs/testing';
import { CreateTenantResponseDto } from './dto/create-tenant-response.dto';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { GetTenantResponseDto } from './dto/get-tenant-response.dto';
import { GetTenantsQueryDto } from './dto/get-tenants-query.dto';
import { GetTenantsResponse } from './dto/get-tenants-response.dto';
import { TenantIdDto } from './dto/tenant-id.dto';
import { UpdateTenantResponseDto } from './dto/update-tenant-response.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';

type Tenants = Awaited<ReturnType<TenantsService['getTenants']>>['tenants'];
type Tenant = Awaited<ReturnType<TenantsService['getTenantById']>>;
type Pagination = Awaited<
  ReturnType<TenantsService['getTenants']>
>['pagination'];

describe('TenantsController', () => {
  let controller: TenantsController;
  let service: jest.Mocked<TenantsService>;

  const mockTenants = [
    {
      tenantId: 'tenant-1',
      name: 'สมชาย ใจดี',
      phone: '0811111111',
      lineId: 'somchai01',
    },
    {
      tenantId: 'tenant-2',
      name: 'สมหญิง รักดี',
      phone: '0822222222',
      lineId: 'som02',
    },
    {
      tenantId: 'tenant-3',
      name: 'John Cena',
      phone: '0833333333',
      lineId: 'johnkub',
    },
  ] satisfies Tenants;

  const mockTenant = {
    tenantId: 'tenant-1',
    name: 'สมชาย ใจดี',
    phone: '0811111111',
    lineId: 'somchai01',
    note: null,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  } satisfies Tenant;

  const mockPagination = {
    page: 1,
    limit: 10,
    total: 3,
    totalPages: 1,
  } satisfies Pagination;

  const getTenantsMock = jest.fn();
  const getTenantByIdMock = jest.fn();
  const createTenantMock = jest.fn();
  const updateTenantMock = jest.fn();
  const deleteTenantMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantsController],
      providers: [
        {
          provide: TenantsService,
          useValue: {
            getTenants: getTenantsMock,
            getTenantById: getTenantByIdMock,
            createTenant: createTenantMock,
            updateTenant: updateTenantMock,
            deleteTenant: deleteTenantMock,
          },
        },
      ],
    }).compile();

    controller = module.get<TenantsController>(TenantsController);
    service = module.get(TenantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTenants', () => {
    const query: GetTenantsQueryDto = {
      page: 1,
      limit: 10,
      offset: 0,
      isRenting: false,
    };

    it('should return tenants with pagination', async () => {
      getTenantsMock.mockResolvedValue({
        tenants: mockTenants,
        pagination: mockPagination,
      });

      const result = await controller.getTenants(query);

      expect(result.data).toEqual(mockTenants);
      expect(result.pagination).toEqual(mockPagination);
      expect(service.getTenants).toHaveBeenCalledTimes(1);
    });

    it('should transform tenant to GetTenantsResponse', async () => {
      getTenantsMock.mockResolvedValue({
        tenants: mockTenants,
        pagination: mockPagination,
      });

      const result = await controller.getTenants(query);

      expect(result.data[0]).toBeInstanceOf(GetTenantsResponse);
    });
  });

  describe('getTenantById', () => {
    it('should transform tenant to GetTenantResponseDto', async () => {
      const params: TenantIdDto = {
        tenantId: 'tenant-1',
      };

      getTenantByIdMock.mockResolvedValue(mockTenant);

      const result = await controller.getTenantById(params);

      expect(result).toBeInstanceOf(GetTenantResponseDto);
      expect(getTenantByIdMock).toHaveBeenCalledWith(params.tenantId);
      expect(service.getTenantById).toHaveBeenCalledTimes(1);
    });
  });

  describe('createTenant', () => {
    it('should transform tenant to CreateTenantResponseDto', async () => {
      const body: CreateTenantDto = {
        name: 'สมชาย ใจดี',
        phone: '0811111111',
        lineId: 'somchai01',
        note: null,
      };

      createTenantMock.mockResolvedValue(mockTenant);

      const result = await controller.createTenant(body);

      expect(result).toBeInstanceOf(CreateTenantResponseDto);
      expect(createTenantMock).toHaveBeenCalledWith(body);
      expect(service.createTenant).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateTenant', () => {
    it('should transform tenant to UpdateTenantResponseDto', async () => {
      const params: TenantIdDto = {
        tenantId: 'tenant-1',
      };

      const body: UpdateTenantDto = {
        phone: '0899999999',
      };

      updateTenantMock.mockResolvedValue({
        ...mockTenant,
        ...body,
      });

      const result = await controller.updateTenant(params, body);

      expect(result).toBeInstanceOf(UpdateTenantResponseDto);
      expect(updateTenantMock).toHaveBeenCalledWith(params.tenantId, body);
      expect(service.updateTenant).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteTenant', () => {
    it('should delete tenant', async () => {
      const params: TenantIdDto = {
        tenantId: 'tenant-1',
      };

      deleteTenantMock.mockResolvedValue(undefined);

      await controller.deleteTenant(params);

      expect(deleteTenantMock).toHaveBeenCalledWith(params.tenantId);
      expect(service.deleteTenant).toHaveBeenCalledTimes(1);
    });
  });
});
