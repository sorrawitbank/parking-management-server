import { ConflictException } from '@nestjs/common';
import ErrorType from '../error-type';
import toScreamingSnake from '../../../utils/to-screaming-snake';

/**
 * Throw a conflict exception with the properties and the error type
 *
 * @param properties - The properties that already exist
 * @returns A conflict exception with the properties and the error type
 */
function throwAlreadyExists(properties: string | string[]) {
  const messages =
    typeof properties === 'string'
      ? [`${toScreamingSnake(properties)}_${ErrorType.ALREADY_EXISTS}`]
      : properties.map(
          (property) =>
            `${toScreamingSnake(property)}_${ErrorType.ALREADY_EXISTS}`,
        );
  const fields =
    typeof properties === 'string'
      ? {
          [properties]: ErrorType.ALREADY_EXISTS,
        }
      : properties.reduce(
          (prev, curr) => ({ ...prev, [curr]: ErrorType.ALREADY_EXISTS }),
          {},
        );
  throw new ConflictException({ messages, fields });
}

export default throwAlreadyExists;
