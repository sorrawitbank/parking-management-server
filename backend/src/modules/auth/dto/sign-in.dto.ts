import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../common/decorators';
import ErrorType from '../../../common/enums/error-type.enum';

export class SignInDto {
  @IsEmail(undefined, { message: ErrorType.INVALID_FORMAT })
  @IsNotEmpty({ message: ErrorType.REQUIRED })
  @Trim()
  readonly email: string;

  @IsString({ message: ErrorType.INVALID_TYPE })
  @IsNotEmpty({ message: ErrorType.REQUIRED })
  readonly password: string;
}
