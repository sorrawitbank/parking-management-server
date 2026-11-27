/**
 * Error types for the validation errors
 *
 * - `REQUIRED` - The field is required - Example: `@IsNotEmpty`
 * - `INVALID_TYPE` - The field is not a valid type - Example: `@IsString` `@IsInt`
 * - `INVALID_FORMAT` - The field is not a valid format - Example: `@IsEmail` `@IsPhoneNumber` `@Matches`
 * - `INVALID_LENGTH` - The field is not a valid length - Example: `@Length`
 * - `TOO_SHORT` - The field is too short - Example: `@MinLength`
 * - `TOO_LONG` - The field is too long - Example: `@MaxLength`
 * - `BELOW_MINIMUM` - The field is below the minimum - Example: `@Min`
 * - `ABOVE_MAXIMUM` - The field is above the maximum - Example: `@Max`
 * - `NOT_FOUND` - Record not found - Example: `@IsNotEmpty`
 * - `ALREADY_EXISTS` - Value already exists
 * - `ALREADY_OCCUPIED` - Value already occupied
 * - `UNPROCESSABLE` - The request is unprocessable
 * - `MISSING_TOKEN` - The request is missing a token
 * - `INVALID_TOKEN` - The request has an invalid token
 * - `INVALID_CREDENTIALS` - The request has invalid credentials
 * - `NOT_AUTHORIZED` - The request is not authorized
 * - `FORBIDDEN` - The request is forbidden
 */
enum ErrorType {
  REQUIRED = 'REQUIRED',
  INVALID_TYPE = 'INVALID_TYPE',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_LENGTH = 'INVALID_LENGTH',
  TOO_SHORT = 'TOO_SHORT',
  TOO_LONG = 'TOO_LONG',
  BELOW_MINIMUM = 'BELOW_MINIMUM',
  ABOVE_MAXIMUM = 'ABOVE_MAXIMUM',
  NOT_FOUND = 'NOT_FOUND',
  UNAVAILABLE = 'UNAVAILABLE',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  ALREADY_OCCUPIED = 'ALREADY_OCCUPIED',
  UNPROCESSABLE = 'UNPROCESSABLE',
  MISSING_TOKEN = 'MISSING_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  NOT_AUTHORIZED = 'NOT_AUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
}

export default ErrorType;
