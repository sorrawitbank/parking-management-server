import { Test, TestingModule } from '@nestjs/testing';
import { CalculationsService } from './calculations.service';

describe('CalculationsService', () => {
  let service: CalculationsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculationsService],
    }).compile();

    service = module.get<CalculationsService>(CalculationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateFee', () => {
    const monthlyFee = 1000;

    it('date is the first day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-01'), monthlyFee);
      expect(result).toEqual(1000);
    });

    it('date is the second day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-02'), monthlyFee);
      expect(result).toEqual(1000);
    });

    it('date is the third day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-03'), monthlyFee);
      expect(result).toEqual(1000);
    });

    it('date is the fourth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-04'), monthlyFee);
      expect(result).toEqual(900);
    });

    it('date is the fifth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-05'), monthlyFee);
      expect(result).toEqual(900);
    });

    it('date is the sixth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-06'), monthlyFee);
      expect(result).toEqual(900);
    });

    it('date is the seventh day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-07'), monthlyFee);
      expect(result).toEqual(800);
    });

    it('date is the eighth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-08'), monthlyFee);
      expect(result).toEqual(800);
    });

    it('date is the ninth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-09'), monthlyFee);
      expect(result).toEqual(800);
    });

    it('date is the tenth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-10'), monthlyFee);
      expect(result).toEqual(700);
    });

    it('date is the eleventh day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-11'), monthlyFee);
      expect(result).toEqual(700);
    });

    it('date is the twelfth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-12'), monthlyFee);
      expect(result).toEqual(700);
    });

    it('date is the thirteenth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-13'), monthlyFee);
      expect(result).toEqual(600);
    });

    it('date is the fourteenth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-14'), monthlyFee);
      expect(result).toEqual(600);
    });

    it('date is the fifteenth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-15'), monthlyFee);
      expect(result).toEqual(600);
    });

    it('date is the sixteenth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-16'), monthlyFee);
      expect(result).toEqual(500);
    });

    it('date is the seventeenth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-17'), monthlyFee);
      expect(result).toEqual(500);
    });

    it('date is the eighteenth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-18'), monthlyFee);
      expect(result).toEqual(500);
    });

    it('date is the nineteenth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-19'), monthlyFee);
      expect(result).toEqual(400);
    });

    it('date is the twentieth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-20'), monthlyFee);
      expect(result).toEqual(400);
    });

    it('date is the twenty-first day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-21'), monthlyFee);
      expect(result).toEqual(400);
    });

    it('date is the twenty-second day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-22'), monthlyFee);
      expect(result).toEqual(1300);
    });

    it('date is the twenty-third day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-23'), monthlyFee);
      expect(result).toEqual(1300);
    });

    it('date is the twenty-fourth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-24'), monthlyFee);
      expect(result).toEqual(1300);
    });

    it('date is the twenty-fifth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-25'), monthlyFee);
      expect(result).toEqual(1000);
    });

    it('date is the twenty-sixth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-26'), monthlyFee);
      expect(result).toEqual(1000);
    });

    it('date is the twenty-seventh day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-27'), monthlyFee);
      expect(result).toEqual(1000);
    });

    it('date is the twenty-eighth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-28'), monthlyFee);
      expect(result).toEqual(1000);
    });

    it('date is the twenty-ninth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-29'), monthlyFee);
      expect(result).toEqual(1000);
    });

    it('date is the thirtieth day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-30'), monthlyFee);
      expect(result).toEqual(1000);
    });

    it('date is the thirty-first day of the month', () => {
      const result = service.calculateFee(new Date('2026-01-31'), monthlyFee);
      expect(result).toEqual(1000);
    });
  });

  describe('calculateCancelFee', () => {
    const monthlyFee = 1000;

    it('date is the first day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-01'),
        monthlyFee,
      );
      expect(result).toEqual(0);
    });

    it('date is the second day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-02'),
        monthlyFee,
      );
      expect(result).toEqual(0);
    });

    it('date is the third day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-03'),
        monthlyFee,
      );
      expect(result).toEqual(0);
    });

    it('date is the fourth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-04'),
        monthlyFee,
      );
      expect(result).toEqual(0);
    });

    it('date is the fifth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-05'),
        monthlyFee,
      );
      expect(result).toEqual(0);
    });

    it('date is the sixth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-06'),
        monthlyFee,
      );
      expect(result).toEqual(0);
    });

    it('date is the seventh day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-07'),
        monthlyFee,
      );
      expect(result).toEqual(0);
    });

    it('date is the eighth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-08'),
        monthlyFee,
      );
      expect(result).toEqual(200);
    });

    it('date is the ninth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-09'),
        monthlyFee,
      );
      expect(result).toEqual(300);
    });

    it('date is the tenth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-10'),
        monthlyFee,
      );
      expect(result).toEqual(300);
    });

    it('date is the eleventh day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-11'),
        monthlyFee,
      );
      expect(result).toEqual(300);
    });

    it('date is the twelfth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-12'),
        monthlyFee,
      );
      expect(result).toEqual(400);
    });

    it('date is the thirteenth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-13'),
        monthlyFee,
      );
      expect(result).toEqual(400);
    });

    it('date is the fourteenth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-14'),
        monthlyFee,
      );
      expect(result).toEqual(400);
    });

    it('date is the fifteenth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-15'),
        monthlyFee,
      );
      expect(result).toEqual(500);
    });

    it('date is the sixteenth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-16'),
        monthlyFee,
      );
      expect(result).toEqual(500);
    });

    it('date is the seventeenth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-17'),
        monthlyFee,
      );
      expect(result).toEqual(500);
    });

    it('date is the eighteenth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-18'),
        monthlyFee,
      );
      expect(result).toEqual(600);
    });

    it('date is the nineteenth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-19'),
        monthlyFee,
      );
      expect(result).toEqual(600);
    });

    it('date is the twentieth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-20'),
        monthlyFee,
      );
      expect(result).toEqual(600);
    });

    it('date is the twenty-first day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-21'),
        monthlyFee,
      );
      expect(result).toEqual(700);
    });

    it('date is the twenty-second day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-22'),
        monthlyFee,
      );
      expect(result).toEqual(700);
    });

    it('date is the twenty-third day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-23'),
        monthlyFee,
      );
      expect(result).toEqual(700);
    });

    it('date is the twenty-fourth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-24'),
        monthlyFee,
      );
      expect(result).toEqual(800);
    });

    it('date is the twenty-fifth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-25'),
        monthlyFee,
      );
      expect(result).toEqual(800);
    });

    it('date is the twenty-sixth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-26'),
        monthlyFee,
      );
      expect(result).toEqual(800);
    });

    it('date is the twenty-seventh day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-27'),
        monthlyFee,
      );
      expect(result).toEqual(900);
    });

    it('date is the twenty-eighth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-28'),
        monthlyFee,
      );
      expect(result).toEqual(900);
    });

    it('date is the twenty-ninth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-29'),
        monthlyFee,
      );
      expect(result).toEqual(900);
    });

    it('date is the thirtieth day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-30'),
        monthlyFee,
      );
      expect(result).toEqual(1000);
    });

    it('date is the thirty-first day of the month', () => {
      const result = service.calculateCancelFee(
        new Date('2026-01-31'),
        monthlyFee,
      );
      expect(result).toEqual(1000);
    });
  });

  describe('calculatePaidUntilMonth', () => {
    describe('should return the correct paid until month for a given date', () => {
      it('date is the twentieth day of the month', () => {
        const result = service.calculatePaidUntilMonth(new Date('2026-01-20'));
        expect(result).toEqual('2026-01-31');
      });

      it('date is the twenty-first day of the month', () => {
        const result = service.calculatePaidUntilMonth(new Date('2026-01-21'));
        expect(result).toEqual('2026-01-31');
      });

      it('date is the twenty-second day of the month', () => {
        const result = service.calculatePaidUntilMonth(new Date('2026-01-22'));
        expect(result).toEqual('2026-02-28');
      });

      it('date is the twenty-third day of the month', () => {
        const result = service.calculatePaidUntilMonth(new Date('2026-01-23'));
        expect(result).toEqual('2026-02-28');
      });

      it('date is the twenty-fourth day of the month in a leap year', () => {
        const result = service.calculatePaidUntilMonth(new Date('2024-01-24'));
        expect(result).toEqual('2024-02-29');
      });
    });
  });
});
