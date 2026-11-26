import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../common/enums/user-role.enum';

export const ROLES_KEY = 'roles';

const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export default Roles;
