import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Trim } from '../../common/decorators';
import ErrorType from '../../common/errors/error-type';

export class CreateTenantDto {
  @Length(2, 100, { message: ErrorType.INVALID_LENGTH })
  @IsString({ message: ErrorType.INVALID_TYPE })
  @IsNotEmpty({ message: ErrorType.REQUIRED })
  @Trim()
  readonly name: string;

  @IsNumberString(undefined, { message: ErrorType.INVALID_TYPE })
  @IsPhoneNumber('TH', { message: ErrorType.INVALID_FORMAT })
  @IsOptional()
  @Trim()
  readonly phone?: string | null;

  @Matches(/^[a-z0-9._-]{4,20}$/, { message: ErrorType.INVALID_FORMAT })
  @IsOptional()
  @Trim()
  readonly lineId?: string | null;

  @Length(1, 500, { message: ErrorType.INVALID_LENGTH })
  @IsString({ message: ErrorType.INVALID_TYPE })
  @IsOptional()
  @Trim()
  readonly note?: string | null;
}
