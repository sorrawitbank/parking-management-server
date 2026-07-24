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
    },
    {
      provinceId: 50,
      nameTh: 'เชียงใหม่',
      nameEn: 'Chiang Mai',
    },
  ] satisfies Provinces;

  const findFirstMock = jest.fn();
  const findManyMock = jest.fn();

  beforeEach(async () => {
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

      const result = await service.getProvinceById(mockProvinces[0].provinceId);

      expect(result).toEqual(mockProvinces[0]);
      expect(findFirstMock).toHaveBeenCalledTimes(1);
      expect(findFirstMock).toHaveBeenCalledWith({ where: expect.anything() });
    });

    it('should throw NotFoundException when province does not exist', async () => {
      findFirstMock.mockResolvedValue(undefined);

      await expect(service.getProvinceById(99)).rejects.toThrow(
        new NotFoundException('Province Not Found'),
      );
    });
  });
});
