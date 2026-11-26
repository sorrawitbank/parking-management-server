import { Expose } from 'class-transformer';
import { UserRole } from '../../../common/enums/user-role.enum';

export class UserResponseDto {
  @Expose()
  userId: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  nickName: string;

  @Expose()
  role: UserRole;

  @Expose()
  isActive: boolean;
}
