import { Test, TestingModule } from '@nestjs/testing';
import { StatusResponseDto } from './dto/status-response.dto';
import { StatusesController } from './statuses.controller';
import { StatusesService } from './statuses.service';

type AssignmentStatuses = Awaited<
  ReturnType<StatusesService['getParkingAssignmentStatuses']>
>;

describe('StatusesController', () => {
  let controller: StatusesController;
  let service: jest.Mocked<StatusesService>;

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
    },
  ] satisfies AssignmentStatuses;

  const getParkingAssignmentStatusesMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusesController],
      providers: [
        {
          provide: StatusesService,
          useValue: {
            getParkingAssignmentStatuses: getParkingAssignmentStatusesMock,
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

  describe('getParkingAssignmentStatuses', () => {
    it('should transform parking assignment statuses to StatusResponseDto', async () => {
      getParkingAssignmentStatusesMock.mockResolvedValue(
        mockAssignmentStatuses,
      );

      const result = await controller.getParkingAssignmentStatuses();

      expect(result[0]).toBeInstanceOf(StatusResponseDto);
      expect(service.getParkingAssignmentStatuses).toHaveBeenCalledTimes(1);
    });
  });
});
