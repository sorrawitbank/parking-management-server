import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * Checks if a given number is less than or equal to the current year.
 */
function IsCurrentYearOrBefore(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCurrentYearOrBefore',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'number') {
            return false;
          }

          return value <= new Date().getFullYear();
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be less than or equal to the current year`;
        },
      },
    });
  };
}

export default IsCurrentYearOrBefore;
