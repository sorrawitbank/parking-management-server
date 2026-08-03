import { ConflictException } from '@nestjs/common';
import ErrorType from '../error-type';
import toScreamingSnake from '../../../utils/to-screaming-snake';

/**
 * Return a conflict exception with the properties and the error type
 *
 * @param properties - The properties that already exist
 * @returns A conflict exception with the properties and the error type
 */
function AlreadyExists(...properties: string[]) {
  const messages = properties.map(
    (property) => `${toScreamingSnake(property)}_${ErrorType.ALREADY_EXISTS}`,
  );
  const fields = properties.reduce(
    (prev, curr) => ({ ...prev, [curr]: ErrorType.ALREADY_EXISTS }),
    {},
  );
  return new ConflictException({ messages, fields });
}

export default AlreadyExists;
