import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StatusesService } from './statuses.service';
import DATABASE_CONNECTION from '../../../database/database-connection';
import { parkingSlotStatuses } from '../../../database/database.schemas';

type SlotStatuses = (typeof parkingSlotStatuses.$inferSelect)[];

describe('StatusesService', () => {
  let service: StatusesService;

  const mockSlotStatuses = [
    {
      slotStatusId: 1,
      nameTh: 'ว่าง',
      nameEn: 'Available',
      backgroundColorLight: '#22C55E',
      backgroundColorDark: '#4ADE80',
      textColorLight: '#FFFFFF',
      textColorDark: '#000000',
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
    },
    {
      slotStatusId: 2,
      nameTh: 'ไม่ว่าง',
      nameEn: 'Occupied',
      backgroundColorLight: '#EF4444',
      backgroundColorDark: '#F87171',
      textColorLight: '#FFFFFF',
      textColorDark: '#000000',
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
    },
    {
      slotStatusId: 3,
      nameTh: 'ไม่พร้อมใช้งาน',
      nameEn: 'Unavailable',
      backgroundColorLight: '#6B7280',
      backgroundColorDark: '#9CA3AF',
      textColorLight: '#FFFFFF',
      textColorDark: '#111827',
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
    },
  ] satisfies SlotStatuses;

  const findFirstMock = jest.fn();
  const findManyMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatusesService,
        {
          provide: DATABASE_CONNECTION,
          useValue: {
            query: {
              parkingSlotStatuses: {
                findFirst: findFirstMock,
                findMany: findManyMock,
              },
            },
          },
        },
      ],
    }).compile();

    service = module.get<StatusesService>(StatusesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getParkingSlotStatuses', () => {
    it('should return an array of all parking slot statuses', async () => {
      findManyMock.mockResolvedValue(mockSlotStatuses);

      const result = await service.getParkingSlotStatuses();

      expect(result).toEqual(mockSlotStatuses);
      expect(findManyMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getParkingSlotStatusById', () => {
    it('should return parking slot status when parking slot status exists', async () => {
      findFirstMock.mockResolvedValue(mockSlotStatuses[0]);

      const result = await service.getParkingSlotStatusById(1);

      expect(result).toEqual(mockSlotStatuses[0]);
      expect(findFirstMock).toHaveBeenCalledTimes(1);
      expect(findFirstMock).toHaveBeenCalledWith({ where: expect.anything() });
    });

    it('should throw NotFoundException when parking slot status does not exist', async () => {
      findFirstMock.mockResolvedValue(undefined);

      try {
        await service.getParkingSlotStatusById(99);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as NotFoundException).getResponse()).toEqual({
          messages: ['PARKING_SLOT_STATUS_NOT_FOUND'],
          fields: {
            parkingSlotStatus: 'NOT_FOUND',
          },
        });
      }
    });
  });
});
