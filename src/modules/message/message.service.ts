import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from 'src/database/schemas/message.schema';
import { CreateMessageDto } from '../../../../common/dto/message.dto';
import { MessageResponse } from './Ro/message.ro';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  async createMessage(dto: CreateMessageDto): Promise<MessageResponse> {
    const createdMessage = new this.messageModel(dto);
    const savedMessage = await createdMessage.save();

    return {
      chatId: savedMessage.chatId,
      sender: savedMessage.sender,
      content: savedMessage.content,
    };
  }
}
