import { UserRole } from '../../../common/enums/user-role.enum';

interface AuthenticatedUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  nickName: string;
  role: UserRole;
}
