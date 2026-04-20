import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../../user/user.service';
import { ResponseMessageEnum } from '../../../../shared/enums/response-message.enum';
import { RecordStatus } from '../../../../shared/enums/record-status';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_KEY,
    });
  }

  async validate(payload: any) {
    if (payload.status === RecordStatus.INACTIVE) {
      throw new HttpException(
        ResponseMessageEnum.ACCOUNT_HAS_BEEN_DELETED,
        HttpStatus.FORBIDDEN,
      );
    }

    return {
      id: payload.id,
      email: payload.email,
    };
  }
}
