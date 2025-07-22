import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from '../../../../common/dto/user/login.dto';
import { RegisterDto } from '../../../../common/dto/user/register.dto';
import { UserResponse } from '../../../../common/ro/user/user-response.ro';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async login(dto: LoginDto): Promise<UserResponse> {
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

  public async register(dto: RegisterDto): Promise<UserResponse> {
    const existingUser = await this.userService.findUserByUserName(
      dto.userName,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    return this.userService.createUser(dto);
  }
}
