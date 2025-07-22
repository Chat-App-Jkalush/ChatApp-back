import { Module } from '@nestjs/common';
import { ChatsController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/database/schemas/chats.schema';
import { ChatGateway } from './gateways/chat-gateway';
import { MessagesModule } from '../message/message.module';
import { ChatCleanupService } from './services/chat-cleanup.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MessagesModule,
  ],
  controllers: [ChatsController],
  providers: [ChatService, ChatGateway, ChatCleanupService],
  exports: [ChatService],
})
export class ChatModule {}
