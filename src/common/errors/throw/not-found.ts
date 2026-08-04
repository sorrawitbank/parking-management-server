import { NotFoundException } from '@nestjs/common';
import ErrorType from '../error-type';
import { toScreamingSnake } from '../../../common/utils';

/**
 * Return a not found exception with the properties and the error type
 *
 * @param properties - The properties that are not found
 * @returns A not found exception with the properties and the error type
 */
function NotFound(...properties: string[]) {
  const messages = properties.map(
    (property) => `${toScreamingSnake(property)}_${ErrorType.NOT_FOUND}`,
  );
  const fields = properties.reduce(
    (prev, curr) => ({ ...prev, [curr]: ErrorType.NOT_FOUND }),
    {},
  );
  return new NotFoundException({ messages, fields });
}

export default NotFound;
