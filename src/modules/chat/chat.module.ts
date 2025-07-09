import { Module } from '@nestjs/common';
import { ChatsController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/database/schemas/chats.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  controllers: [ChatsController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
