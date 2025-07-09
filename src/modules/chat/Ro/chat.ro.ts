import { IsNotEmpty, IsString } from 'class-validator';

export class ChatRo {
  @IsString()
  @IsNotEmpty()
  charName: string;
}
