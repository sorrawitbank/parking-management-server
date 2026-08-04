import { BadRequestException } from '@nestjs/common';
import ErrorType from '../error-type';
import { toScreamingSnake } from '../../../common/utils';

/**
 * Return a bad request exception with the properties and the error type
 *
 * @param properties - The properties that are required
 * @returns A bad request exception with the properties and the error type
 */
function Required(...properties: string[]) {
  const messages = properties.map(
    (property) => `${toScreamingSnake(property)}_${ErrorType.REQUIRED}`,
  );
  const fields = properties.reduce(
    (prev, curr) => ({ ...prev, [curr]: ErrorType.REQUIRED }),
    {},
  );
  return new BadRequestException({ messages, fields });
}

export default Required;
