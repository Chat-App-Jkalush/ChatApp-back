import {
  HttpCode,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/database/schemas/chats.schema';
import { CommonDto, CommonRo } from '../../../../common';
import { User, UserDocument } from 'src/database/schemas/users.schema';
import { chatType } from '../../../../common/enums/chat.enum';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async createChat(
    dto: CommonDto.ChatDto.CreateChatDto,
  ): Promise<{ chatId: string; chatName: string; description: string }> {
    const createdChat = new this.chatModel({
      chatName: dto.chatName,
      description: dto.description,
      messages: [],
      participants: dto.participants ?? [],
      type: dto.type,
    });
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
  ): Promise<Partial<CommonRo.ChatRo.ChatRo>> {
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

  public async updateUserChats(
    userName: string,
    chatId: string,
    chatName: string,
  ): Promise<void> {
    const user = await this.userModel.findOne({ userName }).exec();
    if (!user) throw new Error('User not found');
    if (!user.chats || typeof user.chats !== 'object') user.chats = {};
    user.chats[chatId] = chatName;
    user.markModified('chats');
    await user.save();
  }

  public async paginatedChats(
    userName: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{
    chats: {
      chatId: string;
      chatName: string;
      type: string;
      description: string;
    }[];
    total: number;
  }> {
    const chats = await this.chatModel
      .find({ participants: userName })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const total = await this.chatModel.countDocuments({
      participants: userName,
    });

    const chatList = chats.map((chat) => ({
      chatId: chat._id.toString(),
      chatName: chat.chatName,
      type: chat.type,
      description: chat.description,
    }));

    return { chats: chatList, total };
  }

  public async getChatById(chatId: string): Promise<any> {
    const chat = await this.chatModel
      .findById(chatId)
      .populate('messages')
      .exec();
    if (!chat) {
      throw new Error('Chat not found');
    }
    return {
      chatId: chat._id.toString(),
      chatName: chat.chatName,
      type: chat.type,
      description: chat.description,
      messages: chat.messages,
    };
  }

  public async addMessageToChat(
    chatId: string,
    messageId: string,
  ): Promise<void> {
    const chat = await this.chatModel.findById(chatId).exec();
    if (!chat) {
      throw new Error('Chat not found');
    }
    chat.messages.push(messageId);
    await chat.save();
  }

  public async getChatsByUser(
    userName: string,
  ): Promise<
    { chatId: string; chatName: string; type: string; description: string }[]
  > {
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
          throw new Error('Chat was not found');
        }
        return chat.participants;
      })
      .catch((error) => {
        throw new Error(`Error retrieving participants: ${error.message}`);
      });
  }

  public async leaveChat(userName: string, chatId: string): Promise<boolean> {
    try {
      const chat = await this.chatModel.findById(chatId);
      if (!chat) {
        throw new Error('Chat not found');
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

  public async dmExists(dto: CommonDto.ChatDto.DmExitsDto): Promise<boolean> {
    const { userName1, userName2 } = dto;
    const chat = await this.chatModel.findOne({
      type: chatType.DM,
      participants: { $all: [userName1, userName2] },
    });
    return !!chat;
  }

  public async findDm(dto: CommonDto.ChatDto.DeleteDmDto): Promise<string> {
    const chat = await this.chatModel.findOne({
      type: chatType.DM,
      participants: { $all: [dto.userName1, dto.userName2] },
    });
    if (!chat) {
      throw new NotFoundException('Direct message not found');
    }
    return chat._id.toString();
  }

  public async deleteDm(
    dto: CommonDto.ChatDto.DeleteDmDto,
  ): Promise<{ message: string }> {
    const chatId = await this.findDm(dto);
    const result = await this.chatModel.deleteOne({ _id: chatId });
    if (result.deletedCount === 0) {
      throw new InternalServerErrorException('Failed to delete direct message');
    }
    return { message: 'Direct message deleted successfully' };
  }
}
