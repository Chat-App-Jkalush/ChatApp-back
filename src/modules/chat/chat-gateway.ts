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
  SYSTEM,
} from '../../../../common/constatns/gateway.contants';
import { Message } from 'src/database/schemas/message.schema';

@WebSocketGateway(DEFAULT_PORT, { cors: { origin: CLIENT_ORIGIN } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private userNameToSocket = new Map<string, Socket>();
  private chatIdToSockets = new Map<string, Set<Socket>>();

  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
  ) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {}

  @SubscribeMessage(EVENTS.JOIN_CHAT)
  async handleJoinChat(client: Socket, payload: { userName: string }) {
    const { userName } = payload;
    const previousSocket = this.userNameToSocket.get(userName);
    if (previousSocket && previousSocket.id !== client.id) {
      previousSocket.disconnect(true);
    }
    this.userNameToSocket.set(userName, client);
    const userChats = await this.chatService.getChatsByUser(userName);
    for (const chat of userChats) {
      const chatId = chat.chatId;
      if (!chatId) continue;
      if (!this.chatIdToSockets.has(chatId)) {
        this.chatIdToSockets.set(chatId, new Set());
      }
      this.chatIdToSockets.get(chatId)!.add(client);
      client.join(chatId);
    }
  }

  @SubscribeMessage(EVENTS.LEAVE_CHAT)
  async handleLeaveChat(
    client: Socket,
    payload: { chatId: string; userName: string },
  ) {
    const { chatId, userName } = payload;
    const leaveMessage: CreateMessageDto = {
      chatId,
      sender: SYSTEM,
      content: `${userName} has left the chat.`,
    };
    const messageId = await this.messageService.createAndGetId(leaveMessage);
    await this.chatService.addMessageToChat(chatId, messageId);
    const sockets = this.chatIdToSockets.get(chatId);
    if (sockets) {
      sockets.forEach((socket) => {
        socket.emit(EVENTS.REPLY, leaveMessage);
      });
    }
  }

  @SubscribeMessage(EVENTS.NEW_MESSAGE)
  async handleNewMessage(client: Socket, message: CreateMessageDto) {
    const messageId = await this.messageService.createAndGetId(message);
    await this.chatService.addMessageToChat(message.chatId, messageId);
    if (!this.chatIdToSockets.has(message.chatId)) {
      this.chatIdToSockets.set(message.chatId, new Set());
    }
    const socketsSet = this.chatIdToSockets.get(message.chatId)!;
    if (!socketsSet.has(client)) {
      socketsSet.add(client);
      client.join(message.chatId);
    }
    socketsSet.forEach((socket) => {
      socket.emit(EVENTS.REPLY, message);
    });
  }

  handleDisconnect(client: Socket) {
    for (const [userName, socket] of this.userNameToSocket.entries()) {
      if (socket.id === client.id) {
        this.userNameToSocket.delete(userName);
        break;
      }
    }
    for (const [chatId, sockets] of this.chatIdToSockets.entries()) {
      sockets.delete(client);
    }
  }
}
