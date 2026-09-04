import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProvincesService } from './provinces.service';
import DATABASE_CONNECTION from '../database/database-connection';
import { provinces } from '../database/database.schemas';

type Provinces = (typeof provinces.$inferSelect)[];

describe('ProvincesService', () => {
  let service: ProvincesService;

  const mockProvinces = [
    {
      provinceId: 10,
      nameTh: 'กรุงเทพมหานคร',
      nameEn: 'Bangkok',
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
    },
    {
      provinceId: 50,
      nameTh: 'เชียงใหม่',
      nameEn: 'Chiang Mai',
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
    },
  ] satisfies Provinces;

  const findFirstMock = jest.fn();
  const findManyMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvincesService,
        {
          provide: DATABASE_CONNECTION,
          useValue: {
            query: {
              provinces: {
                findFirst: findFirstMock,
                findMany: findManyMock,
              },
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProvincesService>(ProvincesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProvinces', () => {
    it('should return an array of all provinces', async () => {
      findManyMock.mockResolvedValue(mockProvinces);

      const result = await service.getProvinces();

      expect(result).toEqual(mockProvinces);
      expect(findManyMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProvinceById', () => {
    it('should return province when province exists', async () => {
      findFirstMock.mockResolvedValue(mockProvinces[0]);

      const result = await service.getProvinceById(10);

      expect(result).toEqual(mockProvinces[0]);
      expect(findFirstMock).toHaveBeenCalledTimes(1);
      expect(findFirstMock).toHaveBeenCalledWith({ where: expect.anything() });
    });

    it('should throw NotFoundException when province does not exist', async () => {
      findFirstMock.mockResolvedValue(undefined);

      try {
        await service.getProvinceById(99);
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
  });
});
