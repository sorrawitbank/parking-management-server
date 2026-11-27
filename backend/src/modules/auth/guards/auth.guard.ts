import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthError } from '@supabase/supabase-js';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { UserRole } from '../../../common/enums/user-role.enum';
import { Unauthorized } from '../../../common/errors';
import { EnvironmentService } from '../../../common/services/environment.service';
import { SupabaseAuthService } from '../../../infrastructure/supabase/auth/supabase-auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly supabaseAuthService: SupabaseAuthService,
    private readonly usersService: UsersService,
  ) {}

  private readonly logger = new Logger('Auth');

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
      if (!this.environmentService.isProd) {
        this.logger.warn('Missing token in authorization header');
      }

      throw Unauthorized('MISSING_TOKEN', 'token');
    }

    try {
      const authUser = await this.supabaseAuthService.getUser(token);

      const user = await this.usersService.getUserById(authUser.id);

      if (!user.isActive) {
        this.logger.warn(`User is not active for email: ${user.email}`);

        throw Unauthorized('NOT_AUTHORIZED', 'email');
      }

      const { userId, email, firstName, lastName, nickName, role } = user;

      request.user = {
        userId,
        email,
        firstName,
        lastName,
        nickName,
        role: UserRole[role],
      };

      return true;
    } catch (error) {
      if (error instanceof AuthError) {
        if (!this.environmentService.isProd) {
          this.logger.warn('Invalid token');
        }

        throw Unauthorized('INVALID_TOKEN', 'token');
      } else if (error instanceof HttpException) {
        if (error.getStatus() >= 500) {
          this.logger.error(error);
        } else if (!this.environmentService.isProd) {
          this.logger.warn(error);
        }

        throw error;
      }

      this.logger.error(error);
      throw error;
    }
  }
}
