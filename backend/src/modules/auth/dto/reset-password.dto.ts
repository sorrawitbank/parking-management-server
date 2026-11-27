import { IsNotEmpty, IsString } from 'class-validator';
import ErrorType from '../../../common/enums/error-type.enum';

export class ResetPasswordDto {
  @IsString({ message: ErrorType.INVALID_TYPE })
  @IsNotEmpty({ message: ErrorType.REQUIRED })
  readonly oldPassword: string;

  @IsString({ message: ErrorType.INVALID_TYPE })
  @IsNotEmpty({ message: ErrorType.REQUIRED })
  readonly newPassword: string;
}
