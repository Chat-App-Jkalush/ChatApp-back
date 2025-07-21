import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from '../chat.service';
import { CreateMessageDto } from '../../../../../common/dto';
import { CommonConstants } from '../../../../../common';
import { MessageService } from '../../message/message.service';
import { Message } from 'src/database/schemas/message.schema';

@WebSocketGateway(CommonConstants.GatewayConstants.DEFAULT_PORT, {
  cors: { origin: CommonConstants.GatewayConstants.CLIENT_ORIGIN },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private userNameToSocket: Map<string, Socket> = new Map<string, Socket>();
  private chatIdToSockets: Map<string, Set<Socket>> = new Map<
    string,
    Set<Socket>
  >();

  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
  ) {}

  @WebSocketServer() public server!: Server;

  private broadcastOnlineStatus(userName: string, isOnline: boolean): void {
    this.server.emit('contactOnlineStatus', { userName, isOnline });
  }

  public handleConnection(client: Socket): void {}

  @SubscribeMessage(CommonConstants.GatewayConstants.EVENTS.JOIN_CHAT)
  public async handleJoinChat(
    client: Socket,
    payload: { userName: string },
  ): Promise<void> {
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
    this.broadcastOnlineStatus(userName, true);
  }

  @SubscribeMessage(CommonConstants.GatewayConstants.EVENTS.LEAVE_CHAT)
  public async handleLeaveChat(
    client: Socket,
    payload: { chatId: string; userName: string },
  ): Promise<void> {
    const { chatId, userName } = payload;
    const leaveMessage: CreateMessageDto = {
      chatId,
      sender: CommonConstants.GatewayConstants.SYSTEM,
      content: `${userName} has left the chat.`,
    };
    const messageId = await this.messageService.createAndGetId(leaveMessage);
    await this.chatService.addMessageToChat(chatId, messageId);
    const sockets = this.chatIdToSockets.get(chatId);
    if (sockets) {
      sockets.forEach((socket: Socket) => {
        socket.emit(
          CommonConstants.GatewayConstants.EVENTS.REPLY,
          leaveMessage,
        );
      });
    }
  }

  @SubscribeMessage(CommonConstants.GatewayConstants.EVENTS.NEW_MESSAGE)
  public async handleNewMessage(
    client: Socket,
    message: CreateMessageDto,
  ): Promise<void> {
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
    socketsSet.forEach((socket: Socket) => {
      socket.emit(CommonConstants.GatewayConstants.EVENTS.REPLY, message);
    });
  }

  public handleDisconnect(client: Socket): void {
    let disconnectedUser: string | null = null;
    for (const [userName, socket] of this.userNameToSocket.entries()) {
      if (socket.id === client.id) {
        this.userNameToSocket.delete(userName);
        disconnectedUser = userName;
        break;
      }
    }
    for (const [chatId, sockets] of this.chatIdToSockets.entries()) {
      sockets.delete(client);
    }
    if (disconnectedUser) {
      this.broadcastOnlineStatus(disconnectedUser, false);
    }
  }

  @SubscribeMessage(CommonConstants.GatewayConstants.EVENTS.IS_ONLINE)
  public handleIsOnline(client: Socket, payload: { userName: string }): void {
    const isOnline = this.userNameToSocket.has(payload.userName);
    client.emit('isOnlineResult', { userName: payload.userName, isOnline });
  }

  @SubscribeMessage(CommonConstants.GatewayConstants.EVENTS.GET_ONLINE_USERS)
  public handleGetOnlineUsers(
    client: Socket,
    payload: { contacts: string[] },
  ): void {
    const onlineContacts = payload.contacts.filter((contact: string) =>
      this.userNameToSocket.has(contact),
    );
    client.emit('onlineUsersList', { onlineContacts });
  }
}
