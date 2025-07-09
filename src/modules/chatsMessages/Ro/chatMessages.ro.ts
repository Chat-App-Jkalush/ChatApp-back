import { MessageResponse } from '../../message/Ro/message.ro';
import { MESSAGE_RESPONSE_FIELDS } from '../../../constants/message.constants';

export class ChatMessagesRo {
  result: boolean;
}

type ChatIdField = typeof MESSAGE_RESPONSE_FIELDS.CHAT_ID;
export type GetAllChatMessagesResponse = Array<
  Omit<MessageResponse, ChatIdField>
>;
export interface GetAllChatMessagesIdResponse {
  chatId: string;
}
