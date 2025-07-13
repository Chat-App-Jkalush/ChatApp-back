import { Module } from '@nestjs/common';
import { ChatsController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/database/schemas/chats.schema';
import { User, UserSchema } from 'src/database/schemas/users.schema';
import { ChatGateway } from './chat-gateway';
import { MessagesModule } from '../message/message.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: User.name, schema: UserSchema },
    ]),
    MessagesModule,
  ],
  controllers: [ChatsController],
  providers: [ChatService, ChatGateway, MessagesModule],
  exports: [ChatService],
})
export class ChatModule {}
