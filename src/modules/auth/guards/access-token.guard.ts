import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../shared/decorators/public.decorator';
import { UserService } from '../../user/user.service';
import { ResponseMessageEnum } from '../../../shared/enums/response-message.enum';
import { RecordStatus } from '../../../shared/enums/record-status';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const dbUser = await this.userService.findOne(user.id);

    if (!dbUser || dbUser.status === RecordStatus.INACTIVE) {
      throw new ForbiddenException(
        ResponseMessageEnum.ACCOUNT_HAS_BEEN_DELETED,
      );
    }

    return true;
  }
}
