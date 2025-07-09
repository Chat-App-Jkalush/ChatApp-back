import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../../../../common/dto/user.dto';
import { UserResponse } from '../user/Ro/user.ro';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<UserResponse> {
    return this.authService.login(dto);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<UserResponse> {
    return this.authService.register(dto);
  }
}
