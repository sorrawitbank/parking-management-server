import { ForbiddenException } from '@nestjs/common';
import ErrorType from '../../enums/error-type.enum';
import { toScreamingSnake } from '../../utils';

/**
 * Return a forbidden exception with the properties and the error type
 *
 * @param properties - The properties that are forbidden
 * @returns A forbidden exception with the properties and the error type
 */
function Forbidden(...properties: string[]) {
  const messages = properties.map(
    (property) => `${toScreamingSnake(property)}_${ErrorType.FORBIDDEN}`,
  );
  const fields = properties.reduce(
    (prev, curr) => ({ ...prev, [curr]: ErrorType.FORBIDDEN }),
    {},
  );
  return new ForbiddenException({ messages, fields });
}

export default Forbidden;
