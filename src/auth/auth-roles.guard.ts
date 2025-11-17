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
import { Patient } from 'models/patients.models';

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
      return true;
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;

      const userRole = decoded.role;
      const userId = decoded.user_id;
      const hospitalId = decoded.hospital_id;

      request.user_id = userId;
      request.role = userRole;
      request.hospital_id = hospitalId;

      const paramUserId = request.params.id;
      const paramHospitalId = request.params.hospital_id;
      

      const isOwner = paramUserId && paramUserId === userId;
      const isHospitalOwner = paramHospitalId && paramHospitalId === hospitalId;
      /*
      const paramPatientId = request.params.patient_id;
      const patient_db = Patient.findByPk(paramPatientId);

      const isPatientOwner = patient.hospital.id === hospitalId;*/

      if (!allowedRoles) {
        return true;
      }

      const hasRole = allowedRoles.includes(userRole);

      if (!hasRole && !isOwner && !isHospitalOwner) {
        throw new ForbiddenException('Forbidden');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
