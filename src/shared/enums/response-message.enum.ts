export enum ResponseMessageEnum {
  USER_DOES_NOT_EXIST = 'USER_DOES_NOT_EXIST',
  USER_OR_PASSWORD_INVALID = 'USER_OR_PASSWORD_INVALID',
  USER_DELETED_OR_INACTIVE = 'USER_DELETED_OR_INACTIVE',
  INVALID_OLD_PASSWORD = 'INVALID_OLD_PASSWORD',
  CONFIRM_PASSWORD_INVALID = 'CONFIRM_PASSWORD_INVALID',
  USER_NAME_EXIST = 'USER_NAME_EXIST',
  DATA_TYPE_ERROR = 'DATA_TYPE_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  FORBIDDEN = 'FORBIDDEN',
  ACCOUNT_HAS_BEEN_DELETED = 'ACCOUNT_HAS_BEEN_DELETED',
  NO_DATA = 'NO_DATA',
  PASSWORD_CHANGE_SUCCESS = 'PASSWORD_CHANGE_SUCCESS',
  CURRENT_PASSWORD_INVALID = 'CURRENT_PASSWORD_INVALID',
}

export const ResponseMessageMap = {
  [ResponseMessageEnum.USER_DOES_NOT_EXIST]: 'Tài khoản không tồn tại',
  [ResponseMessageEnum.USER_OR_PASSWORD_INVALID]:
    'Tên tài khoản hoặc mật khẩu không đúng',
  [ResponseMessageEnum.USER_DELETED_OR_INACTIVE]:
    'Tài khoản không hoạt động hoặc đã bị xoá.',
  [ResponseMessageEnum.INVALID_OLD_PASSWORD]: 'Mật khẩu cũ không đúng',
  [ResponseMessageEnum.CONFIRM_PASSWORD_INVALID]:
    'Mật khẩu xác nhận không khớp',
  [ResponseMessageEnum.USER_NAME_EXIST]: 'Username đã tồn tại',
  [ResponseMessageEnum.DATA_TYPE_ERROR]:
    'Dữ liệu truyền lên không đúng định dạng',
  [ResponseMessageEnum.INTERNAL_SERVER_ERROR]: 'Lỗi',
  [ResponseMessageEnum.FORBIDDEN]: 'Không có quyền truy cập',
  [ResponseMessageEnum.PASSWORD_CHANGE_SUCCESS]: 'Thay đổi mật khẩu thành công',
  [ResponseMessageEnum.CURRENT_PASSWORD_INVALID]: 'Mật khẩu cũ không chính xác',
  [ResponseMessageEnum.ACCOUNT_HAS_BEEN_DELETED]:
    'Tài khoản không tồn tại hoặc đã bị xoá',
};
