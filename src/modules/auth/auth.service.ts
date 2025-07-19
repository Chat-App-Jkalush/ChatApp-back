import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CommonDto, CommonRo } from '../../../../common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async login(
    dto: CommonDto.UserDto.LoginDto,
  ): Promise<CommonRo.UserRo.UserResponse> {
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

  public async register(
    dto: CommonDto.UserDto.RegisterDto,
  ): Promise<CommonRo.UserRo.UserResponse> {
    const existingUser = await this.userService.findUserByUserName(
      dto.userName,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    return this.userService.createUser(dto);
  }

  public generateJwt(user: any): string {
    const payload = { sub: user._id, username: user.userName };
    return jwt.sign(payload, process.env.JWT_SECRET || '', {
      expiresIn: '7d',
    });
  }
}
