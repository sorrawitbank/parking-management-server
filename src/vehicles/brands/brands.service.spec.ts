import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BrandsService } from './brands.service';
import DATABASE_CONNECTION from '../../database/database-connection';
import { vehicleBrands } from '../../database/database.schemas';

type VehicleBrands = (typeof vehicleBrands.$inferSelect)[];

describe('BrandsService', () => {
  let service: BrandsService;

  const mockVehicleBrands = [
    {
      vehicleBrandId: 1,
      nameTh: 'โตโยต้า',
      nameEn: 'Toyota',
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
    },
    {
      vehicleBrandId: 2,
      nameTh: 'ฮอนด้า',
      nameEn: 'Honda',
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
    },
  ] satisfies VehicleBrands;

  const findFirstMock = jest.fn();
  const findManyMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandsService,
        {
          provide: DATABASE_CONNECTION,
          useValue: {
            query: {
              vehicleBrands: {
                findFirst: findFirstMock,
                findMany: findManyMock,
              },
            },
          },
        },
      ],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getVehicleBrands', () => {
    it('should return an array of all vehicle brands', async () => {
      findManyMock.mockResolvedValue(mockVehicleBrands);

      const result = await service.getVehicleBrands();

      expect(result).toEqual(mockVehicleBrands);
      expect(findManyMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getVehicleBrandById', () => {
    it('should return vehicle brand when vehicle brand exists', async () => {
      findFirstMock.mockResolvedValue(mockVehicleBrands[0]);

      const result = await service.getVehicleBrandById(1);

      expect(result).toEqual(mockVehicleBrands[0]);
      expect(findFirstMock).toHaveBeenCalledTimes(1);
      expect(findFirstMock).toHaveBeenCalledWith({ where: expect.anything() });
    });

    it('should throw NotFoundException when vehicle brand does not exist', async () => {
      findFirstMock.mockResolvedValue(undefined);

      try {
        await service.getVehicleBrandById(99);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as NotFoundException).getResponse()).toEqual({
          messages: ['VEHICLE_BRAND_NOT_FOUND'],
          fields: {
            vehicleBrand: 'NOT_FOUND',
          },
        });
      }
    });
  });
});
