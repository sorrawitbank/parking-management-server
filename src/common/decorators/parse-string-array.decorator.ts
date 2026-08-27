import { Transform } from 'class-transformer';

/**
 * Parse a comma-separated string into an array of unique strings
 *
 * @returns The array of unique strings
 * @example 'a, b, b, c, d, d, e' => ['a', 'b', 'c', 'd', 'e']
 */
function ParseStringArray() {
  return Transform(({ value }) =>
    value
      ? [
          ...new Set(
            String(value)
              .split(',')
              .map((value) => value.trim()),
          ),
        ]
      : undefined,
  );
}

export default ParseStringArray;
