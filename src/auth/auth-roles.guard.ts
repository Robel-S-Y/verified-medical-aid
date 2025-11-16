import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import * as jwt from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true; // Skip authentication
    }

    const allowedRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      // 3. Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;

      const userRole = decoded.role;
      const userId = decoded.user_id;

      request.user_id = userId;
      request.role = userRole;

      const paramId = request.params.id;

      const isOwner = paramId && paramId === userId;

      if (!allowedRoles) {
        return true;
      }

      const hasRole = allowedRoles.includes(userRole);

      if (!hasRole && !isOwner) {
        throw new ForbiddenException('Forbidden');
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
