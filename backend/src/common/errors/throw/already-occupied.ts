import { ConflictException } from '@nestjs/common';
import ErrorType from '../error-type.enum';
import { toScreamingSnake } from '../../utils';

/**
 * Return a conflict exception with the properties and the error type
 *
 * @param properties - The properties that already occupied
 * @returns A conflict exception with the properties and the error type
 */
function AlreadyOccupied(...properties: string[]) {
  const messages = properties.map(
    (property) => `${toScreamingSnake(property)}_${ErrorType.ALREADY_OCCUPIED}`,
  );
  const fields = properties.reduce(
    (prev, curr) => ({ ...prev, [curr]: ErrorType.ALREADY_OCCUPIED }),
    {},
  );
  return new ConflictException({ messages, fields });
}

export default AlreadyOccupied;
