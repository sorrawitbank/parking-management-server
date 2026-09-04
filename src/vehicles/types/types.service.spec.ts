import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypesService } from './types.service';
import DATABASE_CONNECTION from '../../database/database-connection';
import { vehicleTypes } from '../../database/database.schemas';

type VehicleTypes = (typeof vehicleTypes.$inferSelect)[];

describe('TypesService', () => {
  let service: TypesService;

  const mockVehicleTypes = [
    {
      vehicleTypeId: 1,
      nameTh: 'รถยนต์',
      nameEn: 'Car',
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
    },
    {
      vehicleTypeId: 2,
      nameTh: 'รถจักรยานยนต์',
      nameEn: 'Motorcycle',
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
    },
    {
      vehicleTypeId: 3,
      nameTh: 'รถบรรทุก',
      nameEn: 'Truck',
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
    },
  ] satisfies VehicleTypes;

  const findFirstMock = jest.fn();
  const findManyMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypesService,
        {
          provide: DATABASE_CONNECTION,
          useValue: {
            query: {
              vehicleTypes: {
                findFirst: findFirstMock,
                findMany: findManyMock,
              },
            },
          },
        },
      ],
    }).compile();

    service = module.get<TypesService>(TypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getVehicleTypes', () => {
    it('should return an array of all vehicle types', async () => {
      findManyMock.mockResolvedValue(mockVehicleTypes);

      const result = await service.getVehicleTypes();

      expect(result).toEqual(mockVehicleTypes);
      expect(findManyMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getVehicleTypeById', () => {
    it('should return vehicle type when vehicle type exists', async () => {
      findFirstMock.mockResolvedValue(mockVehicleTypes[0]);

      const result = await service.getVehicleTypeById(1);

      expect(result).toEqual(mockVehicleTypes[0]);
      expect(findFirstMock).toHaveBeenCalledTimes(1);
      expect(findFirstMock).toHaveBeenCalledWith({ where: expect.anything() });
    });

    it('should throw NotFoundException when vehicle type does not exist', async () => {
      findFirstMock.mockResolvedValue(undefined);

      try {
        await service.getVehicleTypeById(99);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as NotFoundException).getResponse()).toEqual({
          messages: ['VEHICLE_TYPE_NOT_FOUND'],
          fields: {
            vehicleType: 'NOT_FOUND',
          },
        });
      }
    });
  });
});
