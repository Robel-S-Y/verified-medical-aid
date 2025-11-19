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
import { Donation } from 'models/donations.models';
import { BlacklistService } from './blacklist/blacklist.service';

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly blacklistService: BlacklistService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
    const isBlacklisted = await this.blacklistService.isBlacklisted(token);
    console.log(isBlacklisted);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been logged out');
    }
    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
    const userRole = decoded.role;
    const userId = decoded.user_id;
    const hospitalId = decoded.hospital_id;

    request.user_id = userId;
    request.role = userRole;
    request.hospital_id = hospitalId;

    const paramUserId = request.params.id;
    const paramHospitalId = request.params.id;
    const paramPatientId = request.params.id;
    const paramDonationId = request.params.id;

    let patient = await Patient.findByPk(paramPatientId);
    let donation = await Donation.findByPk(paramDonationId);

    if (patient) patient = patient.toJSON();
    if (donation) donation = donation.toJSON();

    const isOwner = paramUserId && paramUserId === userId;
    const isHospitalOwner = paramHospitalId && paramHospitalId === hospitalId;
    const isPatientOwner =
      patient?.hospital_id && patient?.hospital_id === hospitalId;
    const isDonationOwner = donation?.donor_id && donation?.donor_id === userId;

    if (!allowedRoles) {
      return true;
    }

    const isVerifyRoute = request.route.path.includes('verify');

    const hasRole = allowedRoles.includes(userRole);

    if (isVerifyRoute && !hasRole) throw new ForbiddenException();

    if (
      !hasRole &&
      !isOwner &&
      !isHospitalOwner &&
      !isPatientOwner &&
      !isDonationOwner
    ) {
      throw new ForbiddenException();
    }

    return true;
  }
}
