import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * Checks if a given Date object has no time component (i.e., hours, minutes, seconds, and milliseconds are all zero).
 */
function IsOnlyDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isOnlyDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
            return false;
          }

          return (
            value.getUTCHours() === 0 &&
            value.getUTCMinutes() === 0 &&
            value.getUTCSeconds() === 0 &&
            value.getUTCMilliseconds() === 0
          );
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a date with no time component`;
        },
      },
    });
  };
}

export default IsOnlyDate;
