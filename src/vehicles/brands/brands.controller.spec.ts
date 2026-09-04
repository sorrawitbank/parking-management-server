import { Test, TestingModule } from '@nestjs/testing';
import { BrandResponseDto } from './dto/brand-response.dto';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';

type VehicleBrands = Awaited<ReturnType<BrandsService['getVehicleBrands']>>;

describe('BrandsController', () => {
  let controller: BrandsController;
  let service: jest.Mocked<BrandsService>;

  const mockVehicleBrands = [
    {
      vehicleBrandId: 1,
      nameTh: 'โตโยต้า',
      nameEn: 'Toyota',
    },
    {
      vehicleBrandId: 2,
      nameTh: 'ฮอนด้า',
      nameEn: 'Honda',
    },
  ] satisfies VehicleBrands;

  const getVehicleBrandsMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandsController],
      providers: [
        {
          provide: BrandsService,
          useValue: {
            getVehicleBrands: getVehicleBrandsMock,
          },
        },
      ],
    }).compile();

    controller = module.get<BrandsController>(BrandsController);
    service = module.get(BrandsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getVehicleBrands', () => {
    it('should transform vehicle brands to BrandResponseDto', async () => {
      getVehicleBrandsMock.mockResolvedValue(mockVehicleBrands);

      const result = await controller.getVehicleBrands();

      expect(result[0]).toBeInstanceOf(BrandResponseDto);
      expect(service.getVehicleBrands).toHaveBeenCalledTimes(1);
    });
  });
});
