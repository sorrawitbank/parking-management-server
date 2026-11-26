import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StatusesService } from './statuses.service';
import DATABASE_CONNECTION from '../../../database/database-connection';
import { parkingAssignmentStatuses } from '../../../database/database.schemas';

type AssignmentStatuses = (typeof parkingAssignmentStatuses.$inferSelect)[];

describe('StatusesService', () => {
  let service: StatusesService;

  const mockAssignmentStatuses = [
    {
      assignmentStatusId: 1,
      nameTh: 'จ่ายแล้ว',
      nameEn: 'Paid',
      backgroundColorLight: '#22C55E',
      backgroundColorDark: '#4ADE80',
      textColorLight: '#FFFFFF',
      textColorDark: '#000000',
      monthDiffRange: {
        lower: 0,
        upper: null,
        lowerInclusive: true,
        upperInclusive: false,
      },
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
    },
    {
      assignmentStatusId: 2,
      nameTh: 'ยังไม่จ่าย',
      nameEn: 'Unpaid',
      backgroundColorLight: '#F59E0B',
      backgroundColorDark: '#FBBF24',
      textColorLight: '#FFFFFF',
      textColorDark: '#000000',
      monthDiffRange: {
        lower: null,
        upper: 0,
        lowerInclusive: true,
        upperInclusive: false,
      },
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
    },
  ] satisfies AssignmentStatuses;

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
              parkingAssignmentStatuses: {
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

  describe('getParkingAssignmentStatuses', () => {
    it('should return an array of all parking assignment statuses', async () => {
      findManyMock.mockResolvedValue(mockAssignmentStatuses);

      const result = await service.getParkingAssignmentStatuses();

      expect(result).toEqual(mockAssignmentStatuses);
      expect(findManyMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getParkingAssignmentStatusById', () => {
    it('should return parking assignment status when parking assignment status exists', async () => {
      findFirstMock.mockResolvedValue(mockAssignmentStatuses[0]);

      const result = await service.getParkingAssignmentStatusById(1);

      expect(result).toEqual(mockAssignmentStatuses[0]);
      expect(findFirstMock).toHaveBeenCalledTimes(1);
      expect(findFirstMock).toHaveBeenCalledWith({ where: expect.anything() });
    });

    it('should throw NotFoundException when parking assignment status does not exist', async () => {
      findFirstMock.mockResolvedValue(undefined);

      try {
        await service.getParkingAssignmentStatusById(99);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as NotFoundException).getResponse()).toEqual({
          messages: ['PARKING_ASSIGNMENT_STATUS_NOT_FOUND'],
          fields: {
            parkingAssignmentStatus: 'NOT_FOUND',
          },
        });
      }
    });
  });
});
