import { Transform } from 'class-transformer';

/**
 * Parse a comma-separated string into an array of unique numbers
 *
 * @returns The array of unique numbers
 * @example '1, 2, 2, 3, 4, 4, 5' => [1, 2, 3, 4, 5]
 */
function ParseNumberArray() {
  return Transform(({ value }) => [
    ...new Set(String(value).split(',').map(Number)),
  ]);
}

export default ParseNumberArray;
