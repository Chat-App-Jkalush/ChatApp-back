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
  ) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('user connected ', client.id);
  }

  @SubscribeMessage(EVENTS.JOIN_CHAT)
  handleJoinChat(
    client: Socket,
    payload: { chatId: string; userName: string },
  ) {
    const { chatId, userName } = payload;
    console.log(
      `[JOIN_CHAT] userName: ${userName}, chatId: ${chatId}, socketId: ${client.id}`,
    );
    this.userNameToSocket.set(userName, client);

    if (!this.chatIdToSockets.has(chatId)) {
      this.chatIdToSockets.set(chatId, new Set());
      console.log(`[JOIN_CHAT] Created new chatId set for: ${chatId}`);
    }
    this.chatIdToSockets.get(chatId)!.add(client);
    console.log(`[JOIN_CHAT] Added socket ${client.id} to chatId ${chatId}`);

    client.join(chatId);
    console.log(`[JOIN_CHAT] Socket ${client.id} joined room ${chatId}`);
  }

  @SubscribeMessage(EVENTS.NEW_MESSAGE)
  async handleNewMessage(client: Socket, message: CreateMessageDto) {
    console.log(`[NEW_MESSAGE] Received from socket ${client.id}:`, message);
    const messageId = await this.messageService.createAndGetId(message);
    await this.chatService.addMessageToChat(message.chatId, messageId);
    console.log(
      `[NEW_MESSAGE] Saved messageId ${messageId} to chat ${message.chatId}`,
    );

    const sockets = this.chatIdToSockets.get(message.chatId);
    if (sockets) {
      console.log(
        `[NEW_MESSAGE] Broadcasting to ${sockets.size} sockets in chatId ${message.chatId}`,
      );
      sockets.forEach((socket) => {
        socket.emit(EVENTS.REPLY, message);
        console.log(`[NEW_MESSAGE] Emitted to socket ${socket.id}`);
      });
    } else {
      console.log(
        `[NEW_MESSAGE] No sockets found for chatId ${message.chatId}`,
      );
    }
  }

  handleDisconnect(client: Socket) {
    console.log('user disconnected ', client.id);
    for (const [userName, socket] of this.userNameToSocket.entries()) {
      if (socket.id === client.id) {
        this.userNameToSocket.delete(userName);
        break;
      }
    }
    for (const sockets of this.chatIdToSockets.values()) {
      sockets.delete(client);
    }
  }
}
