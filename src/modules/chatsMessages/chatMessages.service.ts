import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ChatMessages } from 'src/database/schemas/ChatMessages.schema';
import { ChatMessagesRo } from './Ro/chatMessages.ro';
import { CreateChatMessagesDto } from '../../../../common/dto/chatMessages.dto';

@Injectable()
export class ChatMessagesService {
  constructor(
    @InjectModel(ChatMessages.name)
    private readonly chatMessagesModel: Model<ChatMessages>,
  ) {}

  async createChatMessage(dto: CreateChatMessagesDto): Promise<ChatMessagesRo> {
    const created = await this.chatMessagesModel.create(dto);
    return {
      result: created ? true : false,
    };
  }
}
