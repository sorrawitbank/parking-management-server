import { NotFoundException } from '@nestjs/common';
import ErrorType from '../error-type';
import toScreamingSnake from '../../../utils/to-screaming-snake';

/**
 * Return a not found exception with the properties and the error type
 *
 * @param properties - The properties that are not found
 * @returns A not found exception with the properties and the error type
 */
function NotFound(properties: string | string[]) {
  const messages =
    typeof properties === 'string'
      ? [`${toScreamingSnake(properties)}_${ErrorType.NOT_FOUND}`]
      : properties.map(
          (property) => `${toScreamingSnake(property)}_${ErrorType.NOT_FOUND}`,
        );
  const fields =
    typeof properties === 'string'
      ? {
          [properties]: ErrorType.NOT_FOUND,
        }
      : properties.reduce(
          (prev, curr) => ({ ...prev, [curr]: ErrorType.NOT_FOUND }),
          {},
        );
  return new NotFoundException({ messages, fields });
}

export default NotFound;
