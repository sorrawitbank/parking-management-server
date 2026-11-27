import { ConflictException } from '@nestjs/common';
import ErrorType from '../enums/error-type.enum';
import { toScreamingSnake } from '../utils';

/**
 * Return a conflict exception with the properties and the error type
 *
 * @param properties - The properties that are unavailable
 * @returns A conflict exception with the properties and the error type
 */
function Unavailable(...properties: string[]) {
  const messages = properties.map(
    (property) => `${toScreamingSnake(property)}_${ErrorType.UNAVAILABLE}`,
  );
  const fields = properties.reduce(
    (prev, curr) => ({ ...prev, [curr]: ErrorType.UNAVAILABLE }),
    {},
  );
  return new ConflictException({ messages, fields });
}

export default Unavailable;
