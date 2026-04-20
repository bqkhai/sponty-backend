import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Req,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthService } from './jwt/jwt-auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { Public } from '../../shared/decorators/public.decorator';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private jwtAuthService: JwtAuthService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.jwtAuthService.login(req.user);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    const userId = req.user['id'];
    return this.jwtAuthService.refreshTokens(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return await this.userService.getProfile(req.user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Put('update-profile')
  async updateProfile(@Body() dto: UpdateUserDto, @Req() req) {
    return await this.userService.updateProfile(req.user.id, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('profile')
  async deleteProfile(@Request() req) {
    return this.authService.deleteProfile(req.user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Put('change-password')
  changePassword(@Body() dto: ChangePasswordDto, @Req() req) {
    return this.authService.changePassword(req.user.id, dto);
  }
}
