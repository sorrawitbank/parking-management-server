import { HttpException, Injectable, Logger } from '@nestjs/common';
import { AuthError } from '@supabase/supabase-js';
import { UsersService } from '../users/users.service';
import { Unauthorized } from '../../common/errors/throw';
import { EnvironmentService } from '../../common/services/environment.service';
import { SupabaseAuthService } from '../../infrastructure/supabase/auth/supabase-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly supabaseAuthService: SupabaseAuthService,
    private readonly usersService: UsersService,
  ) {}

  private readonly logger = new Logger('Auth');

  async signIn(email: string, password: string) {
    try {
      const authData = await this.supabaseAuthService.signIn(email, password);

      const user = await this.usersService.getUserById(authData.user.id);

      if (!user.isActive) {
        this.logger.warn(`User is not active for email: ${email}`);

        throw Unauthorized('NOT_AUTHORIZED', 'email');
      }

      return {
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        expiresIn: authData.session.expires_in,
        user,
      };
    } catch (error) {
      if (error instanceof AuthError && error.code === 'invalid_credentials') {
        if (!this.environmentService.isProd) {
          this.logger.warn(`Invalid credentials for email: ${email}`);
        }

        throw Unauthorized('INVALID_CREDENTIALS', 'email', 'password');
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
