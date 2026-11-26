import { Test, TestingModule } from '@nestjs/testing';
import { TypeResponseDto } from './dto/type-response.dto';
import { TypesController } from './types.controller';
import { TypesService } from './types.service';

type VehicleTypes = Awaited<ReturnType<TypesService['getVehicleTypes']>>;

describe('TypesController', () => {
  let controller: TypesController;
  let service: jest.Mocked<TypesService>;

  const mockVehicleTypes = [
    {
      vehicleTypeId: 1,
      nameTh: 'รถยนต์',
      nameEn: 'Car',
    },
    {
      vehicleTypeId: 2,
      nameTh: 'รถจักรยานยนต์',
      nameEn: 'Motorcycle',
    },
    {
      vehicleTypeId: 3,
      nameTh: 'รถบรรทุก',
      nameEn: 'Truck',
    },
  ] satisfies VehicleTypes;

  const getVehicleTypesMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypesController],
      providers: [
        {
          provide: TypesService,
          useValue: {
            getVehicleTypes: getVehicleTypesMock,
          },
        },
      ],
    }).compile();

    controller = module.get<TypesController>(TypesController);
    service = module.get(TypesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getVehicleTypes', () => {
    it('should transform vehicle types to TypeResponseDto', async () => {
      getVehicleTypesMock.mockResolvedValue(mockVehicleTypes);

      const result = await controller.getVehicleTypes();

      expect(result[0]).toBeInstanceOf(TypeResponseDto);
      expect(service.getVehicleTypes).toHaveBeenCalledTimes(1);
    });
  });
});
