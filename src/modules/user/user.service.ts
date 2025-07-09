import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/database/schemas/users.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../../../common/dto/user/user.dto';
import { UserResponse } from './Ro/user.ro';
import { BCRYPT_SALT_ROUNDS } from 'src/constants/auth.constants';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private mapToUserResponse(user: UserDocument): UserResponse {
    return {
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  async createUser(dto: CreateUserDto): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    const createdUser = new this.userModel({
      ...dto,
      password: hashedPassword,
    });

    const savedUser = await createdUser.save();
    return this.mapToUserResponse(savedUser);
  }
}
