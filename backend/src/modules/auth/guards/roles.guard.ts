import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';
import { Forbidden } from '../../../common/errors/throw';
import { EnvironmentService } from '../../../common/services/environment.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly reflecto: Reflector,
  ) {}

  private readonly logger = new Logger('Auth');

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflecto.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user;

    if (!user || !requiredRoles.includes(user.role)) {
      if (!this.environmentService.isProd) {
        this.logger.warn(
          `User does not have the required roles: ${requiredRoles.join(', ')}`,
        );
      }

      throw Forbidden('user');
    }

    return true;
  }
}
