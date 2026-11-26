import { Test, TestingModule } from '@nestjs/testing';
import { GetSlotWithStatusResponseDto } from './dto/get-slot-with-status-response.dto';
import { SlotResponseDto } from './dto/slot-response.dto';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';

type Slots = Awaited<ReturnType<SlotsService['getParkingSlots']>>;
type SlotsWithStatus = Awaited<
  ReturnType<SlotsService['getParkingSlotsWithStatus']>
>;

describe('SlotsController', () => {
  let controller: SlotsController;
  let service: jest.Mocked<SlotsService>;

  const mockSlots = [
    {
      slotId: 'slot-1',
      slotNo: 1,
      slotCode: 'SLOT01',
      positionLeft: 1,
      positionTop: 1,
      width: 1,
      height: 1,
      isUnavailable: false,
    },
    {
      slotId: 'slot-2',
      slotNo: 2,
      slotCode: 'SLOT02',
      positionLeft: 2,
      positionTop: 1,
      width: 1,
      height: 1,
      isUnavailable: false,
    },
    {
      slotId: 'slot-3',
      slotNo: 3,
      slotCode: 'SLOT03',
      positionLeft: 3,
      positionTop: 1,
      width: 1,
      height: 1,
      isUnavailable: false,
    },
  ] satisfies Slots;

  const mockSlotsWithStatus = [
    {
      slotId: 'slot-1',
      slotStatusId: 1,
    },
    {
      slotId: 'slot-2',
      slotStatusId: 1,
    },
    {
      slotId: 'slot-3',
      slotStatusId: 1,
    },
  ] satisfies SlotsWithStatus;

  const getParkingSlotsMock = jest.fn();
  const getParkingSlotsWithStatusMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlotsController],
      providers: [
        {
          provide: SlotsService,
          useValue: {
            getParkingSlots: getParkingSlotsMock,
            getParkingSlotsWithStatus: getParkingSlotsWithStatusMock,
          },
        },
      ],
    }).compile();

    controller = module.get<SlotsController>(SlotsController);
    service = module.get(SlotsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getParkingSlots', () => {
    it('should transform parking slot to SlotResponseDto', async () => {
      getParkingSlotsMock.mockResolvedValue(mockSlots);

      const result = await controller.getParkingSlots();

      expect(result[0]).toBeInstanceOf(SlotResponseDto);
      expect(service.getParkingSlots).toHaveBeenCalledTimes(1);
    });
  });

  describe('getParkingSlotsWithStatus', () => {
    it('should transform parking slot with status to GetSlotWithStatusResponseDto', async () => {
      getParkingSlotsWithStatusMock.mockResolvedValue(mockSlotsWithStatus);

      const result = await controller.getParkingSlotsWithStatus();

      expect(result[0]).toBeInstanceOf(GetSlotWithStatusResponseDto);
      expect(service.getParkingSlotsWithStatus).toHaveBeenCalledTimes(1);
    });
  });
});
