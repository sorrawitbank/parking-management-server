import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SlotsService } from './slots.service';
import DATABASE_CONNECTION from '../../database/database-connection';
import {
  parkingSlots,
  parkingSlotsWithStatus,
} from '../../database/database.schemas';

type Slots = (typeof parkingSlots.$inferSelect)[];
type SlotsWithStatus = (typeof parkingSlotsWithStatus.$inferSelect)[];

describe('SlotsService', () => {
  let service: SlotsService;

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
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
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
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
    },
    {
      slotId: 'slot-3',
      slotNo: 3,
      slotCode: 'SLOT03',
      positionLeft: 3,
      positionTop: 1,
      width: 1,
      height: 1,
      isUnavailable: true,
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
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

  const selectMock = jest.fn();
  const findFirstMock = jest.fn();
  const findManyMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlotsService,
        {
          provide: DATABASE_CONNECTION,
          useValue: {
            select: selectMock,
            query: {
              parkingSlots: {
                findFirst: findFirstMock,
                findMany: findManyMock,
              },
            },
          },
        },
      ],
    }).compile();

    service = module.get<SlotsService>(SlotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getParkingSlots', () => {
    it('should return an array of all parking slots', async () => {
      findManyMock.mockResolvedValue(mockSlots);

      const result = await service.getParkingSlots();

      expect(result).toEqual(mockSlots);
      expect(findManyMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getParkingSlotsWithStatus', () => {
    it('should return an array of all parking slots with status', async () => {
      const from = jest.fn().mockResolvedValue(mockSlotsWithStatus);

      selectMock.mockReturnValue({ from });

      const result = await service.getParkingSlotsWithStatus();

      expect(result).toEqual(mockSlotsWithStatus);
      expect(selectMock).toHaveBeenCalledTimes(1);
      expect(from).toHaveBeenCalledWith(parkingSlotsWithStatus);
    });
  });

  describe('getParkingSlotById', () => {
    it('should return parking slot when parking slot exists', async () => {
      findFirstMock.mockResolvedValue(mockSlots[0]);

      const result = await service.getParkingSlotById('slot-1');

      expect(result).toEqual(mockSlots[0]);
      expect(findFirstMock).toHaveBeenCalledTimes(1);
      expect(findFirstMock).toHaveBeenCalledWith({ where: expect.anything() });
    });

    it('should throw NotFoundException when parking slot does not exist', async () => {
      findFirstMock.mockResolvedValue(undefined);

      try {
        await service.getParkingSlotById('not-found');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as NotFoundException).getResponse()).toEqual({
          messages: ['PARKING_SLOT_NOT_FOUND'],
          fields: {
            parkingSlot: 'NOT_FOUND',
          },
        });
      }
    });
  });

  describe('getParkingSlotsWithStatusById', () => {
    it('should return parking slot with status when parking slot exists', async () => {
      const where = jest.fn().mockResolvedValue([mockSlotsWithStatus[0]]);
      const from = jest.fn().mockReturnValue({ where });

      selectMock.mockReturnValue({ from });

      const result = await service.getParkingSlotsWithStatusById('slot-1');

      expect(result).toEqual(mockSlotsWithStatus[0]);
      expect(selectMock).toHaveBeenCalledTimes(1);
      expect(from).toHaveBeenCalledWith(parkingSlotsWithStatus);
      expect(where).toHaveBeenCalledWith(expect.anything());
    });

    it('should throw NotFoundException when parking slot with status does not exist', async () => {
      const where = jest.fn().mockResolvedValue([]);
      const from = jest.fn().mockReturnValue({ where });

      selectMock.mockReturnValue({ from });
      try {
        await service.getParkingSlotsWithStatusById('not-found');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as NotFoundException).getResponse()).toEqual({
          messages: ['PARKING_SLOT_NOT_FOUND'],
          fields: {
            parkingSlot: 'NOT_FOUND',
          },
        });
      }
    });
  });
});
