import { Test, TestingModule } from '@nestjs/testing';
import { StatusResponseDto } from './dto/status-response.dto';
import { StatusesController } from './statuses.controller';
import { StatusesService } from './statuses.service';

type SlotStatuses = Awaited<
  ReturnType<StatusesService['getParkingSlotStatuses']>
>;

describe('StatusesController', () => {
  let controller: StatusesController;
  let service: jest.Mocked<StatusesService>;

  const mockSlotStatuses = [
    {
      slotStatusId: 1,
      nameTh: 'ว่าง',
      nameEn: 'Available',
      backgroundColorLight: '#22C55E',
      backgroundColorDark: '#4ADE80',
      textColorLight: '#FFFFFF',
      textColorDark: '#000000',
    },
    {
      slotStatusId: 2,
      nameTh: 'ไม่ว่าง',
      nameEn: 'Occupied',
      backgroundColorLight: '#EF4444',
      backgroundColorDark: '#F87171',
      textColorLight: '#FFFFFF',
      textColorDark: '#000000',
    },
    {
      slotStatusId: 3,
      nameTh: 'ไม่พร้อมใช้งาน',
      nameEn: 'Unavailable',
      backgroundColorLight: '#6B7280',
      backgroundColorDark: '#9CA3AF',
      textColorLight: '#FFFFFF',
      textColorDark: '#111827',
    },
  ] satisfies SlotStatuses;

  const getParkingSlotStatusesMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusesController],
      providers: [
        {
          provide: StatusesService,
          useValue: {
            getParkingSlotStatuses: getParkingSlotStatusesMock,
          },
        },
      ],
    }).compile();

    controller = module.get<StatusesController>(StatusesController);
    service = module.get(StatusesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getParkingSlotStatuses', () => {
    it('should transform parking slot statuses to StatusResponseDto', async () => {
      getParkingSlotStatusesMock.mockResolvedValue(mockSlotStatuses);

      const result = await controller.getParkingSlotStatuses();

      expect(result[0]).toBeInstanceOf(StatusResponseDto);
      expect(service.getParkingSlotStatuses).toHaveBeenCalledTimes(1);
    });
  });
});
