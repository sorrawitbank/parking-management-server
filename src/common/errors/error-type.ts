type Error =
  | 'REQUIRED'
  | 'INVALID_TYPE'
  | 'INVALID_FORMAT'
  | 'INVALID_LENGTH'
  | 'TOO_SHORT'
  | 'TOO_LONG'
  | 'BELOW_MINIMUM'
  | 'ABOVE_MAXIMUM'
  | 'NOT_FOUND'
  | 'ALREADY_EXISTS';

/**
 * `ERROR_TYPES` - Error types for the validation errors
 *
 * - `REQUIRED` - \@IsNotEmpty - The field is required
 * - `INVALID_TYPE` - \@IsString \@IsInt - The field is not a valid type
 * - `INVALID_FORMAT` - \@IsEmail \@IsPhoneNumber \@Matches - The field is not a valid format
 * - `INVALID_LENGTH` - \@Length - The field is not a valid length
 * - `TOO_SHORT` - \@MinLength - The field is too short
 * - `TOO_LONG` - \@MaxLength - The field is too long
 * - `BELOW_MINIMUM` - \@Min - The field is below the minimum
 * - `ABOVE_MAXIMUM` - \@Max - The field is above the maximum
 * - `NOT_FOUND` - Record not found
 * - `ALREADY_EXISTS` - Value already exists
 */
const ErrorType: Record<Error, string> = {
  REQUIRED: 'REQUIRED',
  INVALID_TYPE: 'INVALID_TYPE',
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_LENGTH: 'INVALID_LENGTH',
  TOO_SHORT: 'TOO_SHORT',
  TOO_LONG: 'TOO_LONG',
  BELOW_MINIMUM: 'BELOW_MINIMUM',
  ABOVE_MAXIMUM: 'ABOVE_MAXIMUM',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const;

export default ErrorType;
