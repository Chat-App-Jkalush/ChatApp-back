import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CommonDto, CommonRo } from '../../../../common';
import { Response } from 'express';
import { JwtService } from '../chat/services/jwt.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  public async login(
    @Body() dto: CommonDto.UserDto.LoginDto,
    @Res() response: Response,
  ): Promise<Response | void> {
    try {
      const user = await this.authService.login(dto);
      const token = this.jwtService.generateJwt(user);
      response.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return response.json(user);
    } catch (error: any) {
      response.status(400).json({
        message: error.message || 'Login failed',
      });
    }
  }

  @Post('register')
  public async register(
    @Body() dto: CommonDto.UserDto.RegisterDto,
    @Res() response: Response,
  ): Promise<Response | void> {
    try {
      const user = await this.authService.register(dto);
      const token = this.jwtService.generateJwt(user);
      response.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return response.json(user);
    } catch (error: any) {
      response.status(400).json({
        message: error.message || 'Registration failed',
      });
    }
  }

  @Post('logout')
  public logout(@Res() res: Response): Response {
    res.clearCookie('token');
    return res.json({ message: 'Logged out' });
  }
}
