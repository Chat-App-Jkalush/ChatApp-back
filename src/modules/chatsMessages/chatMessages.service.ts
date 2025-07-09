import { Model } from 'mongoose';
import { Injectable, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ChatMessages } from 'src/database/schemas/ChatMessages.schema';
import {
  ChatMessagesRo,
  GetAllChatMessagesIdResponse,
  GetAllChatMessagesResponse,
} from './Ro/chatMessages.ro';
import { CreateChatMessagesDto } from '../../../../common/dto/chatMessages.dto';
import { MessageService } from '../message/message.service';

@Injectable()
export class ChatMessagesService {
  constructor(
    @InjectModel(ChatMessages.name)
    private readonly chatMessagesModel: Model<ChatMessages>,
    private readonly messageService: MessageService,
  ) {}

  async createChatMessage(dto: CreateChatMessagesDto): Promise<ChatMessagesRo> {
    const created = await this.chatMessagesModel.create(dto);
    return {
      result: created ? true : false,
    };
  }

  async getAllByChatId(
    @Query() chatId: string,
  ): Promise<GetAllChatMessagesResponse> {
    const chatMessages = await this.chatMessagesModel.find({ chatId }).exec();
    const messages = await Promise.all(
      chatMessages.map(async (chatMessage) => {
        return this.messageService.getById(chatMessage.messageId);
      }),
    );
    return messages;
  }
}
