import { IntersectionType } from '@nestjs/mapped-types';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { AuditResponseDto } from '../../../common/dto/audit-response.dto';

class UserInSignInDto extends IntersectionType(
  UserResponseDto,
  AuditResponseDto,
) {}

export class SignInResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  expiresIn: number;

  @Expose()
  @Type(() => UserInSignInDto)
  user: UserInSignInDto;
}
