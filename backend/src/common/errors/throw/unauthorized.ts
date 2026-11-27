import { UnauthorizedException } from '@nestjs/common';
import ErrorType from '../../enums/error-type.enum';
import { toScreamingSnake } from '../../utils';

/**
 * Return an unauthorized exception with the given type and properties
 *
 * @param errorType - The type of unauthorized exception
 * @param properties - The properties to include in the exception
 * @returns An unauthorized exception with the properties and the error type
 */
function Unauthorized(
  errorType:
    | 'MISSING_TOKEN'
    | 'INVALID_TOKEN'
    | 'INVALID_CREDENTIALS'
    | 'NOT_AUTHORIZED',
  ...properties: string[]
) {
  const messages = properties.map(
    (property) => `${toScreamingSnake(property)}_${ErrorType[errorType]}`,
  );
  const fields = properties.reduce(
    (prev, curr) => ({ ...prev, [curr]: ErrorType[errorType] }),
    {},
  );
  return new UnauthorizedException({ messages, fields });
}

export default Unauthorized;
