import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { DEFAULT_PORT, EVENTS } from 'src/constants/gateway.contants';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from '../../../../common/dto/message.dto';
import { MessageService } from '../message/message.service';
@WebSocketGateway(DEFAULT_PORT, {})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private userNameToSocket = new Map<string, Socket>();
  private chatIdToSockets = new Map<string, Set<Socket>>();

  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage(EVENTS.JOIN_CHAT)
  handleJoinChat(
    client: Socket,
    payload: { chatId: string; userName: string },
  ) {
    const { chatId, userName } = payload;
    this.userNameToSocket.set(userName, client);

    if (!this.chatIdToSockets.has(chatId)) {
      this.chatIdToSockets.set(chatId, new Set());
    }
    this.chatIdToSockets.get(chatId)!.add(client);

    client.join(chatId);
  }

  @SubscribeMessage(EVENTS.NEW_MESSAGE)
  async handleNewMessage(client: Socket, message: CreateMessageDto) {
    const messageId = await this.messageService.createAndGetId(message);
    await this.chatService.addMessageToChat(message.chatId, messageId);

    const sockets = this.chatIdToSockets.get(message.chatId);
    if (sockets) {
      sockets.forEach((socket) => {
        socket.emit(EVENTS.REPLY, message);
      });
    }
  }

  handleConnection(client: Socket, userName: string) {
    this.userNameToSocket.set(userName, client);
    client.join(userName);

    client.emit(EVENTS.JOIN_CHAT, { message: 'You have joined the chat' });
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
