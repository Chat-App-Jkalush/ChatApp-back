import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from '../../../../common/dto/message.dto';
import { MessageService } from '../message/message.service';
import {
  CLIENT_ORIGIN,
  DEFAULT_PORT,
  EVENTS,
} from '../../../../common/constatns/gateway.contants';

@WebSocketGateway(DEFAULT_PORT, { cors: { origin: CLIENT_ORIGIN } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private userNameToSocket = new Map<string, Socket>();
  private chatIdToSockets = new Map<string, Set<Socket>>();

  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
  ) {
    console.log('[ChatGateway] Initialized');
  }

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('[ChatGateway] user connected', client.id);
  }

  @SubscribeMessage(EVENTS.JOIN_CHAT)
  async handleJoinChat(client: Socket, payload: { userName: string }) {
    const { userName } = payload;
    console.log(
      `[ChatGateway] [JOIN_CHAT] userName: ${userName}, socketId: ${client.id}`,
    );

    const previousSocket = this.userNameToSocket.get(userName);
    if (previousSocket && previousSocket.id !== client.id) {
      previousSocket.disconnect(true);
      console.log(
        `[ChatGateway] [JOIN_CHAT] Disconnected previous socket for user ${userName}`,
      );
    }

    this.userNameToSocket.set(userName, client);

    const userChats = await this.chatService.getChatsByUser(userName);
    for (const chat of userChats) {
      const chatId = chat.chatId;
      if (!chatId) continue;

      if (!this.chatIdToSockets.has(chatId)) {
        this.chatIdToSockets.set(chatId, new Set());
        console.log(
          `[ChatGateway] [JOIN_CHAT] Created new chatId set for: ${chatId}`,
        );
      }
      this.chatIdToSockets.get(chatId)!.add(client);
      client.join(chatId);
      console.log(
        `[ChatGateway] [JOIN_CHAT] Socket ${client.id} joined room ${chatId}`,
      );
    }
  }

  @SubscribeMessage(EVENTS.NEW_MESSAGE)
  async handleNewMessage(client: Socket, message: CreateMessageDto) {
    console.log(
      '[ChatGateway] [NEW_MESSAGE] Received from socket',
      client.id,
      message,
    );
    const messageId = await this.messageService.createAndGetId(message);
    await this.chatService.addMessageToChat(message.chatId, messageId);
    console.log(
      `[ChatGateway] [NEW_MESSAGE] Saved messageId ${messageId} to chat ${message.chatId}`,
    );

    const sockets = this.chatIdToSockets.get(message.chatId);
    if (sockets) {
      console.log(
        `[ChatGateway] [NEW_MESSAGE] Broadcasting to ${sockets.size} sockets in chatId ${message.chatId}`,
      );
      sockets.forEach((socket) => {
        socket.emit(EVENTS.REPLY, message);
        console.log(
          `[ChatGateway] [NEW_MESSAGE] Emitted to socket ${socket.id}`,
        );
      });
    } else {
      console.log(
        `[ChatGateway] [NEW_MESSAGE] No sockets found for chatId ${message.chatId}`,
      );
    }
  }

  handleDisconnect(client: Socket) {
    console.log('[ChatGateway] user disconnected', client.id);
    for (const [userName, socket] of this.userNameToSocket.entries()) {
      if (socket.id === client.id) {
        this.userNameToSocket.delete(userName);
        console.log(`[ChatGateway] Removed userName mapping for ${userName}`);
        break;
      }
    }
    for (const [chatId, sockets] of this.chatIdToSockets.entries()) {
      if (sockets.delete(client)) {
        console.log(
          `[ChatGateway] Removed socket ${client.id} from chatId ${chatId}`,
        );
      }
    }
  }
}
