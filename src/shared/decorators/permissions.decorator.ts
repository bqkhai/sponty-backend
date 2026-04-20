import { SetMetadata } from '@nestjs/common';
import { PermissionsEnum } from '../enums/permissions.enum';

export const PERMISSIONS_KEY = 'permission';
export const Permissions = (...permission: PermissionsEnum[]) =>
  SetMetadata(PERMISSIONS_KEY, permission);
