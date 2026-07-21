import { customType } from 'drizzle-orm/pg-core';

export interface Int4RangeValue {
  lower: number | null;
  upper: number | null;
  lowerInclusive?: boolean;
  upperInclusive?: boolean;
}

export const int4range = customType<{
  data: Int4RangeValue;
  driverData: string;
}>({
  dataType() {
    return 'int4range';
  },

  // Convert TypeScript data into a Postgres range string representation
  toDriver(value: Int4RangeValue): string {
    const leftBracket = (value.lowerInclusive ?? true) ? '[' : '(';
    const rightBracket = (value.upperInclusive ?? false) ? ']' : ')';
    const lowerStr = value.lower !== null ? value.lower : '';
    const upperStr = value.upper !== null ? value.upper : '';

    return `${leftBracket}${lowerStr},${upperStr}${rightBracket}`;
  },

  // Parse PostgreSQL range string representation back into a JavaScript object
  fromDriver(value: string): Int4RangeValue {
    // Matches patterns like [1,10) or [,] or (,5]
    const match = value.match(/^([\[\(])(-?\d*),(-?\d*)([\]\)])$/);
    if (!match) {
      return { lower: null, upper: null };
    }

    const [, left, lower, upper, right] = match;
    return {
      lower: lower !== '' ? parseInt(lower, 10) : null,
      upper: upper !== '' ? parseInt(upper, 10) : null,
      lowerInclusive: left === '[',
      upperInclusive: right === ']',
    };
  },
});
