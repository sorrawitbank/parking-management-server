import toStartOfDayUtc from './to-start-of-day-utc';

describe('toStartOfDayUtc', () => {
  it('should return the start of the day in UTC for a date in local time', () => {
    const result = toStartOfDayUtc(new Date('2026-01-01T06:00:00'));
    expect(result).toEqual(new Date('2026-01-01'));
  });

  it('should return the start of the day in UTC for a date in a positive timezone', () => {
    const result = toStartOfDayUtc(new Date('2026-01-01T06:00:00+09:00'));
    expect(result).toEqual(new Date('2026-01-01'));
  });

  it('should return the start of the day in UTC for a date in a negative timezone', () => {
    const result = toStartOfDayUtc(new Date('2026-01-01T06:00:00-09:00'));
    expect(result).toEqual(new Date('2026-01-01'));
  });
});
