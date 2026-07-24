import { Test, TestingModule } from '@nestjs/testing';
import { ProvinceResponseDto } from './dto/province-response.dto';
import { ProvincesController } from './provinces.controller';
import { ProvincesService } from './provinces.service';

type Provinces = Awaited<ReturnType<ProvincesService['getProvinces']>>;

describe('ProvincesController', () => {
  let controller: ProvincesController;
  let service: jest.Mocked<ProvincesService>;

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

  const getProvincesMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvincesController],
      providers: [
        {
          provide: ProvincesService,
          useValue: {
            getProvinces: getProvincesMock,
          },
        },
      ],
    }).compile();

    controller = module.get<ProvincesController>(ProvincesController);
    service = module.get(ProvincesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProvinces', () => {
    it('should transform provinces to ProvinceResponseDto', async () => {
      getProvincesMock.mockResolvedValue(mockProvinces);

      const result = await controller.getProvinces();

      expect(result).toEqual(mockProvinces);
      expect(service.getProvinces).toHaveBeenCalledTimes(1);
      expect(result[0]).toBeInstanceOf(ProvinceResponseDto);
    });
  });
});
