export enum PermissionsEnum {
  // User Management
  USER_VIEW = 'USER_VIEW',
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',

  // Role Management
  ROLE_VIEW = 'ROLE_VIEW',
  ROLE_CREATE = 'ROLE_CREATE',
  ROLE_UPDATE = 'ROLE_UPDATE',
  ROLE_DELETE = 'ROLE_DELETE',

  // Permission Management
  PERMISSION_VIEW = 'PERMISSION_VIEW',
  PERMISSION_CREATE = 'PERMISSION_CREATE',
  PERMISSION_UPDATE = 'PERMISSION_UPDATE',
  PERMISSION_DELETE = 'PERMISSION_DELETE',
}

export const PermissionDescriptions: Record<PermissionsEnum, string> = {
  [PermissionsEnum.USER_VIEW]: 'Xem người dùng',
  [PermissionsEnum.USER_CREATE]: 'Tạo người dùng',
  [PermissionsEnum.USER_UPDATE]: 'Cập nhật người dùng',
  [PermissionsEnum.USER_DELETE]: 'Xoá người dùng',

  [PermissionsEnum.ROLE_VIEW]: 'Xem vai trò',
  [PermissionsEnum.ROLE_CREATE]: 'Tạo vai trò',
  [PermissionsEnum.ROLE_UPDATE]: 'Cập nhật vai trò',
  [PermissionsEnum.ROLE_DELETE]: 'Xoá vai trò',

  [PermissionsEnum.PERMISSION_VIEW]: 'Xem quyền',
  [PermissionsEnum.PERMISSION_CREATE]: 'Tạo quyền',
  [PermissionsEnum.PERMISSION_UPDATE]: 'Cập nhật quyền',
  [PermissionsEnum.PERMISSION_DELETE]: 'Xoá quyền',
};
