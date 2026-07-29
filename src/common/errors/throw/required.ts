import { BadRequestException } from '@nestjs/common';
import ErrorType from '../error-type';
import toScreamingSnake from '../../../utils/to-screaming-snake';

/**
 * Return a bad request exception with the properties and the error type
 *
 * @param properties - The properties that are required
 * @returns A bad request exception with the properties and the error type
 */
function Required(properties: string | string[]) {
  const messages =
    typeof properties === 'string'
      ? [`${toScreamingSnake(properties)}_${ErrorType.REQUIRED}`]
      : properties.map(
          (property) => `${toScreamingSnake(property)}_${ErrorType.REQUIRED}`,
        );
  const fields =
    typeof properties === 'string'
      ? {
          [properties]: ErrorType.REQUIRED,
        }
      : properties.reduce(
          (prev, curr) => ({ ...prev, [curr]: ErrorType.REQUIRED }),
          {},
        );
  return new BadRequestException({ messages, fields });
}

export default Required;
