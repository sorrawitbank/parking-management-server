import { Test, TestingModule } from '@nestjs/testing';
import { CreateVehicleResponseDto } from './dto/create-vehicle-response.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { GetVehicleResponseDto } from './dto/get-vehicle-response.dto';
import { GetVehiclesQueryDto } from './dto/get-vehicles-query.dto';
import { GetVehiclesResponse } from './dto/get-vehicles-response.dto';
import { UpdateVehicleResponseDto } from './dto/update-vehicle-response.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleIdDto } from './dto/vehicle-id.dto';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

type Vehicles = Awaited<ReturnType<VehiclesService['getVehicles']>>['vehicles'];
type Vehicle = Awaited<ReturnType<VehiclesService['getVehicleById']>>;
type Pagination = Awaited<
  ReturnType<VehiclesService['getVehicles']>
>['pagination'];

describe('VehiclesController', () => {
  let controller: VehiclesController;
  let service: jest.Mocked<VehiclesService>;

  const mockVehicles = [
    {
      vehicleId: 'vehicle-1',
      licensePlatePrefix: 'กข',
      licensePlateNumber: '1000',
      provinceId: 10,
      vehicleTypeId: 1,
      vehicleBrandId: 1,
      tenant: {
        tenantId: 'tenant-1',
        name: 'สมชาย ใจดี',
      },
    },
    {
      vehicleId: 'vehicle-2',
      licensePlatePrefix: 'กค',
      licensePlateNumber: '1000',
      provinceId: 10,
      vehicleTypeId: 2,
      vehicleBrandId: 1,
      tenant: {
        tenantId: 'tenant-1',
        name: 'สมชาย ใจดี',
      },
    },
    {
      vehicleId: 'vehicle-3',
      licensePlatePrefix: 'กง',
      licensePlateNumber: '1000',
      provinceId: 50,
      vehicleTypeId: 1,
      vehicleBrandId: 2,
      tenant: {
        tenantId: 'tenant-2',
        name: 'สมหญิง รักดี',
      },
    },
  ] satisfies Vehicles;

  const mockVehicle = {
    vehicleId: 'vehicle-1',
    licensePlatePrefix: 'กข',
    licensePlateNumber: '1000',
    provinceId: 10,
    vehicleTypeId: 1,
    vehicleBrandId: 1,
    note: 'รถคันนี้สีแดง',
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
    tenant: {
      tenantId: 'tenant-1',
      name: 'สมชาย ใจดี',
    },
  } satisfies Vehicle;

  const mockPagination = {
    page: 1,
    limit: 10,
    total: 3,
    totalPages: 1,
  } satisfies Pagination;

  const getVehiclesMock = jest.fn();
  const getVehicleByIdMock = jest.fn();
  const createVehicleMock = jest.fn();
  const updateVehicleMock = jest.fn();
  const deleteVehicleMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        {
          provide: VehiclesService,
          useValue: {
            getVehicles: getVehiclesMock,
            getVehicleById: getVehicleByIdMock,
            createVehicle: createVehicleMock,
            updateVehicle: updateVehicleMock,
            deleteVehicle: deleteVehicleMock,
          },
        },
      ],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
    service = module.get(VehiclesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getVehicles', () => {
    const query: GetVehiclesQueryDto = {
      page: 1,
      limit: 10,
      offset: 0,
    };

    it('should return vehicles with pagination', async () => {
      getVehiclesMock.mockResolvedValue({
        vehicles: mockVehicles,
        pagination: mockPagination,
      });

      const result = await controller.getVehicles(query);

      expect(result.data).toEqual(mockVehicles);
      expect(result.pagination).toEqual(mockPagination);
      expect(service.getVehicles).toHaveBeenCalledTimes(1);
    });

    it('should transform vehicle to GetVehiclesResponse', async () => {
      getVehiclesMock.mockResolvedValue({
        vehicles: mockVehicles,
        pagination: mockPagination,
      });

      const result = await controller.getVehicles(query);

      expect(result.data[0]).toBeInstanceOf(GetVehiclesResponse);
    });
  });

  describe('getVehicleById', () => {
    it('should transform vehicle to GetVehicleResponseDto', async () => {
      const params: VehicleIdDto = {
        vehicleId: 'vehicle-1',
      };

      getVehicleByIdMock.mockResolvedValue(mockVehicle);

      const result = await controller.getVehicleById(params);

      expect(result).toBeInstanceOf(GetVehicleResponseDto);
      expect(getVehicleByIdMock).toHaveBeenCalledWith(params.vehicleId);
      expect(service.getVehicleById).toHaveBeenCalledTimes(1);
    });
  });

  describe('createVehicle', () => {
    it('should transform vehicle to CreateVehicleResponseDto', async () => {
      const body: CreateVehicleDto = {
        licensePlatePrefix: 'กข',
        licensePlateNumber: '1000',
        note: 'รถคันนี้สีแดง',
        tenantId: 'tenant-1',
        provinceId: 10,
        vehicleTypeId: 1,
        vehicleBrandId: 1,
      };

      createVehicleMock.mockResolvedValue(mockVehicle);

      const result = await controller.createVehicle(body);

      expect(result).toBeInstanceOf(CreateVehicleResponseDto);
      expect(createVehicleMock).toHaveBeenCalledWith(body);
      expect(service.createVehicle).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateVehicle', () => {
    it('should transform vehicle to UpdateVehicleResponseDto', async () => {
      const params: VehicleIdDto = {
        vehicleId: 'vehicle-1',
      };

      const body: UpdateVehicleDto = {
        licensePlatePrefix: 'กค',
      };

      updateVehicleMock.mockResolvedValue({
        ...mockVehicle,
        ...body,
      });

      const result = await controller.updateVehicle(params, body);

      expect(result).toBeInstanceOf(UpdateVehicleResponseDto);
      expect(updateVehicleMock).toHaveBeenCalledWith(params.vehicleId, body);
      expect(service.updateVehicle).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteVehicle', () => {
    it('should delete vehicle', async () => {
      const params: VehicleIdDto = {
        vehicleId: 'vehicle-1',
      };

      deleteVehicleMock.mockResolvedValue(undefined);

      await controller.deleteVehicle(params);

      expect(deleteVehicleMock).toHaveBeenCalledWith(params.vehicleId);
      expect(service.deleteVehicle).toHaveBeenCalledTimes(1);
    });
  });
});
