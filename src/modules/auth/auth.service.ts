import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from '../../../../common/dto/user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserResponse } from '../../../../common/Ro/user.ro';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(dto: LoginDto): Promise<UserResponse> {
    const user = await this.userService.findUserByUserName(dto.userName);
    if (!user) {
      throw new BadRequestException('UserName not found');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return this.userService.mapToUserResponse(user);
  }

  async register(dto: RegisterDto): Promise<UserResponse> {
    const existingUser = await this.userService.findUserByUserName(
      dto.userName,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    return this.userService.createUser(dto);
  }

  generateJwt(user: any): string {
    const payload = { sub: user._id, username: user.userName };
    return jwt.sign(payload, process.env.JWT_SECRET || '', {
      expiresIn: '7d',
    });
  }
}
