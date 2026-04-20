import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAlphaNumeric(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsAlphaNumeric',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          const alphanumericRegex = /^[a-zA-Z0-9]+$/;
          const isAlphanumeric = alphanumericRegex.test(value);
          return isAlphanumeric;
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          return 'Tên đăng nhập là chuỗi chỉ chứa chữ cái và số, không có khoảng trắng';
        },
      },
    });
  };
}
