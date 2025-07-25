import {
  BadRequestException,
  HttpCode,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './schemas/chats.schema';
import { CreateChatDto } from '../../../../common/dto/chat/create-chat.dto';
import { ChatRo } from '../../../../common/ro/chat/chat.ro';
import { User, UserDocument } from 'src/modules/user/schemas/users.schema';
import { chatType } from '../../../../common/enums/chat.enum';
import { PaginatedChatsRo } from '../../../../common/ro/chat/paginated-chats.ro';
import { EmbeddedMessage } from 'src/modules/chat/schemas/embedded-message.schema';
import { DeleteDmResponseRo } from '../../../../common/ro/chat/delete-dm-response.ro';
import { DmExistsDto } from '../../../../common/dto/chat/dm-exists.dto';
import { GetPaginatedChatsDto } from '../../../../common/dto/chat/get-paginated-chats.dto';
import { CreateMessageDto } from '../../../../common/dto/message/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async createChat(dto: CreateChatDto): Promise<ChatRo> {
    const createdChat = new this.chatModel({
      chatName: dto.chatName,
      description: dto.description,
      messages: [],
      participants: dto.participants ?? [],
      type: dto.type,
    });
    console.log('Creating chat with participants:', dto.participants);
    const savedChat = await createdChat.save();

    return {
      chatId: savedChat._id.toString(),
      chatName: savedChat.chatName,
      description: savedChat.description,
    };
  }

  public async addUserToChat(
    userName: string,
    chatId: string,
  ): Promise<Partial<ChatRo>> {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (!chat.participants.includes(userName)) {
      chat.participants.push(userName);
      await chat.save();
    }

    return {
      chatName: chat.chatName,
      description: chat.description,
    };
  }

  public async updateUserChats(userName: string): Promise<void> {
    const user = await this.userModel.findOne({ userName }).exec();
    if (!user) throw new BadRequestException('User not found');
    user.markModified('chats');
    await user.save();
  }

  public async paginatedChats(
    dto: GetPaginatedChatsDto,
  ): Promise<PaginatedChatsRo> {
    const query: Partial<{
      participants: string;
      chatName?: { $regex: string; $options: string };
    }> = { participants: dto.userName };
    if (dto.search) {
      query.chatName = { $regex: '^' + dto.search, $options: 'i' };
    }

    const chats = await this.chatModel
      .find(query)
      .skip((dto.page - 1) * dto.pageSize)
      .limit(dto.pageSize)
      .exec();

    const total = await this.chatModel.countDocuments(query);

    const chatList = chats.map((chat) => ({
      chatId: chat._id.toString(),
      chatName: chat.chatName,
      type: chat.type,
      description: chat.description,
    }));

    return { chats: chatList, total };
  }

  public async getChatById(chatId: string): Promise<any> {
    const chat = await this.chatModel.findById(chatId).exec();
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }
    return {
      chatId: chat._id.toString(),
      chatName: chat.chatName,
      type: chat.type,
      description: chat.description,
      messages: chat.messages,
    };
  }

  public async getChatsByUser(userName: string): Promise<ChatRo[]> {
    const chats = await this.chatModel.find({ participants: userName }).exec();
    return chats.map((chat) => ({
      chatId: chat._id.toString(),
      chatName: chat.chatName,
      type: chat.type,
      description: chat.description,
    }));
  }

  public getChatParticipants(chatId: string): Promise<string[]> {
    return this.chatModel
      .findById(chatId)
      .then((chat) => {
        if (!chat) {
          throw new BadRequestException('Chat was not found');
        }
        return chat.participants;
      })
      .catch((error) => {
        throw new BadRequestException(
          `Error retrieving participants: ${error.message}`,
        );
      });
  }

  public async leaveChat(userName: string, chatId: string): Promise<boolean> {
    try {
      const chat = await this.chatModel.findById(chatId);
      if (!chat) {
        throw new BadRequestException('Chat not found');
      }
      chat.participants = chat.participants.filter(
        (participant) => participant !== userName,
      );
      await chat.save();
      return true;
    } catch (error: any) {
      throw new Error(`Error leaving chat: ${error.message}`);
    }
  }

  public async dmExists(dto: DmExistsDto): Promise<boolean> {
    const { userName1, userName2 } = dto;
    const chat = await this.chatModel.findOne({
      type: chatType.DM,
      participants: { $all: [userName1, userName2] },
    });
    return !!chat;
  }

  public async findDm(dto: DmExistsDto): Promise<string> {
    const chat = await this.chatModel.findOne({
      type: chatType.DM,
      participants: { $all: [dto.userName1, dto.userName2] },
    });
    if (!chat) {
      throw new NotFoundException('Direct message not found');
    }
    return chat._id.toString();
  }

  public async deleteDm(dto: DmExistsDto): Promise<DeleteDmResponseRo> {
    const chatId = await this.findDm(dto);
    const result = await this.chatModel.deleteOne({ _id: chatId });
    if (result.deletedCount === 0) {
      throw new InternalServerErrorException('Failed to delete direct message');
    }
    return { message: 'Direct message deleted successfully' };
  }

  public async addMessageToChat(
    dto: CreateMessageDto,
  ): Promise<EmbeddedMessage> {
    const chat = await this.chatModel.findById(dto.chatId);
    if (!chat) throw new Error('Chat not found');
    const embeddedMessage: EmbeddedMessage = {
      sender: dto.sender,
      content: dto.content,
      createdAt: new Date(),
    };
    chat.messages.push(embeddedMessage);
    await chat.save();
    return embeddedMessage;
  }
}
