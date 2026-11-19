import { Transform } from 'class-transformer';

/**
 * Parse a string into a boolean value
 *
 * @returns The boolean value
 * @example 'true' => true
 * @example 'false' => false
 * @example 'TRUE' => true
 * @example 'FALSE' => false
 * @example '1' => true (if strict is false)
 * @example '0' => false (if strict is false)
 */
function ParseBoolean(
  options = {
    /**
     * If `strict` is `true`, the decorator will only accept 'true' and 'false' (case-insensitive) as valid boolean values. Any other value will be returned as is.
     *
     * @default false
     */
    strict: false,
  },
) {
  return Transform(({ value }) => {
    if (!value) {
      return undefined;
    }

    if (!options.strict && Number.isSafeInteger(Number(value))) {
      return Number(value) !== 0;
    }

    switch (String(value).toLowerCase()) {
      case 'false':
        return false;
      case 'true':
        return true;
      default:
        return options.strict ? value : false;
    }
  });
}

export default ParseBoolean;
