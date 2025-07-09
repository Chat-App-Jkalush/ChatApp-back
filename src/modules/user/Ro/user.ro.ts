import { IsNotEmpty, IsString } from 'class-validator';
import { USERFIELDS } from '../../../constants/user.constants';

export class User {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

type PasswordField = typeof USERFIELDS.PASSWORD;
export type UserResponse = Partial<Omit<User, PasswordField>>;
