import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../../../../common/dto/user.dto';
import { Response } from 'express';
import { UserResponse } from '../../../../common/Ro/user.ro';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() response: Response) {
    try {
      const user = await this.authService.login(dto);
      const token = this.authService.generateJwt(user);
      response.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return response.json(user);
    } catch (error) {
      response.status(400).json({
        message: error.message || 'Login failed',
      });
    }
  }

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() response: Response) {
    try {
      const user = await this.authService.register(dto);
      const token = this.authService.generateJwt(user);
      response.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return response.json(user);
    } catch (error) {
      response.status(400).json({
        message: error.message || 'Registration failed',
      });
    }
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token');
    return res.json({ message: 'Logged out' });
  }
}
