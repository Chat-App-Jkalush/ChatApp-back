import { Module } from '@nestjs/common';
import { ChatsController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/database/schemas/chats.schema';
import { User, UserSchema } from 'src/database/schemas/users.schema';
import { Message, MessageSchema } from 'src/database/schemas/message.schema';
import { ChatGateway } from './chat-gateway';
import { MessagesModule } from '../message/message.module';
import { ChatCleanupService } from './services/chatCleanup.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: User.name, schema: UserSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    MessagesModule,
  ],
  controllers: [ChatsController],
  providers: [ChatService, ChatGateway, ChatCleanupService],
  exports: [ChatService],
})
export class ChatModule {}
