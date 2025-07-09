import { IsBoolean } from 'class-validator';

export class ChatMessagesRo {
  @IsBoolean()
  result: boolean;
}
