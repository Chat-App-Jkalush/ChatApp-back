import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './database/database.module';
import { ContactModule } from './modules/contact/contact.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { MessagesModule } from './modules/message/message.module';
import { ChatsUsersModule } from './modules/ChatsUsers/chatsUsers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    ContactModule,
    MessagesModule,
    AuthModule,
    ChatModule,
    ChatsUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
