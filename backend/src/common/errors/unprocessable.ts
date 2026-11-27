import { UnprocessableEntityException } from '@nestjs/common';
import ErrorType from '../enums/error-type.enum';
import { toScreamingSnake } from '../utils';

/**
 * Return a unprocessable entity exception with the properties and the error type
 *
 * @param properties - The properties that are unprocessable
 * @returns A unprocessable entity exception with the properties and the error type
 */
function Unprocessable(...properties: string[]) {
  const messages = properties.map(
    (property) => `${toScreamingSnake(property)}_${ErrorType.UNPROCESSABLE}`,
  );
  const fields = properties.reduce(
    (prev, curr) => ({ ...prev, [curr]: ErrorType.UNPROCESSABLE }),
    {},
  );
  return new UnprocessableEntityException({ messages, fields });
}

export default Unprocessable;
