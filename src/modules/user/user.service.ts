import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/database/schemas/users.schema';
import * as bcrypt from 'bcrypt';
import { BackendConstants } from 'src/constants/backend.constants';
import { RegisterDto } from '../../../../common/dto/user/register.dto';
import { UserResponse } from '../../../../common/ro/user/user-response.ro';
import { PaginatedUsersRo } from '../../../../common/ro/user/paginated-users.ro';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public mapToUserResponse(user: UserDocument): UserResponse {
    return {
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  public async createUser(dto: RegisterDto): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(
      dto.password,
      BackendConstants.AuthConstants.BCRYPT_SALT_ROUNDS,
    );

    const createdUser = new this.userModel({
      ...dto,
      password: hashedPassword,
      contacts: [],
      chats: {},
    });

    const savedUser = await createdUser.save();
    return this.mapToUserResponse(savedUser);
  }

  public async getUserByUserName(
    userName: string,
  ): Promise<UserResponse | null> {
    const user = await this.userModel.findOne({ userName }).exec();
    return user ? this.mapToUserResponse(user) : null;
  }

  public async findUserByUserName(
    userName: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({ userName }).exec();
  }

  public async updateUserProfile(
    body: Partial<{
      userName: string;
      firstName: string;
      lastName: string;
      password: string;
    }>,
  ): Promise<UserResponse> {
    const user = await this.userModel
      .findOne({ userName: body.userName })
      .exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (body.firstName !== undefined && body.firstName.trim() !== '')
      user.firstName = body.firstName;
    if (body.lastName !== undefined && body.lastName.trim() !== '')
      user.lastName = body.lastName;
    if (body.password !== undefined && body.password.trim() !== '') {
      user.password = await bcrypt.hash(
        body.password,
        BackendConstants.AuthConstants.BCRYPT_SALT_ROUNDS,
      );
    }

    const updatedUser = await user.save();
    return this.mapToUserResponse(updatedUser);
  }

  public async paginatedUsers(
    userName: string,
    page: number = 1,
    pageSize: number = 10,
    search?: string,
  ): Promise<PaginatedUsersRo> {
    const currentUser = await this.userModel.findOne({ userName }).exec();
    const contacts = currentUser?.contacts || [];
    const exclude = [userName, ...contacts];
    const query: any = { userName: { $nin: exclude } };
    if (search) {
      query.userName.$regex = '^' + search;
      query.userName.$options = 'i';
    }
    const total = await this.userModel.countDocuments(query);
    const users = await this.userModel
      .find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();
    return {
      users: users.map((user) => this.mapToUserResponse(user)),
      total,
    };
  }
}
