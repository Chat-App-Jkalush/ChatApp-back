import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from '../../../../common/dto/user.dto';
import { UserResponse } from '../user/Ro/user.ro';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(dto: LoginDto): Promise<UserResponse> {
    const user = await this.userService.findUserByUserName(dto.userName);
    if (!user) {
      throw new Error('UserName not found');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    return {
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  async register(dto: RegisterDto): Promise<UserResponse> {
    const existingUser = await this.userService.findUserByUserName(
      dto.userName,
    );
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = {
      userName: dto.userName,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: hashedPassword,
    };

    return this.userService.createUser(newUser);
  }
}
