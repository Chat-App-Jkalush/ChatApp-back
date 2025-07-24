import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from '../../chat.service';
import { CreateMessageDto } from '../../../../../../common/dto/message/create-message.dto';
import { CommonConstants } from '../../../../../../common';
import { ChatCleanupService } from '../chat-cleanup.service';
import { BackendConstants } from 'src/constants';
import { MessageInfoDTO } from '../../../../../../kafka-microservice/dist/common/dto/message/message-info.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@WebSocketGateway(CommonConstants.GatewayConstants.DEFAULT_PORT, {
  cors: { origin: CommonConstants.GatewayConstants.CLIENT_ORIGIN },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private userNameToSocket: Map<string, Socket> = new Map<string, Socket>();
  private chatIdToSockets: Map<string, Set<Socket>> = new Map<
    string,
    Set<Socket>
  >();

  private static lastCleanup: number = 0;
  private static CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

  constructor(
    private chatService: ChatService,
    private chatCleanupService: ChatCleanupService,
  ) {}

  @WebSocketServer() public server!: Server;

  private broadcastOnlineStatus(userName: string, isOnline: boolean): void {
    this.server.emit(
      CommonConstants.GatewayConstants.EVENTS.CONTACT_ONLINE_STATUS,
      { userName, isOnline },
    );
  }

  public notifyAddedToChat(participants: string[]): void {
    participants.forEach((userName) => {
      const socket = this.userNameToSocket.get(userName);
      if (socket) {
        socket.emit(CommonConstants.GatewayConstants.EVENTS.ADDED_TO_CHAT);
      }
    });
  }

  public async handleConnection(client: Socket): Promise<void> {
    const now = Date.now();
    if (now - ChatGateway.lastCleanup > ChatGateway.CLEANUP_INTERVAL_MS) {
      ChatGateway.lastCleanup = now;
      await this.chatCleanupService.manualCleanup();
    }
  }

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

      client.emit(CommonConstants.GatewayConstants.EVENTS.JOIN_NEW_CHAT, {
        chatId,
      });
    }

    this.broadcastOnlineStatus(userName, true);
  }

  @SubscribeMessage(CommonConstants.GatewayConstants.EVENTS.JOIN_ROOM)
  public handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string },
  ): void {
    client.join(payload.chatId);
    if (!this.chatIdToSockets.has(payload.chatId)) {
      this.chatIdToSockets.set(payload.chatId, new Set());
    }
    this.chatIdToSockets.get(payload.chatId)!.add(client);
  }

  @SubscribeMessage(CommonConstants.GatewayConstants.EVENTS.JOIN_NEW_CHAT)
  public async handleJoinNewChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string; targetUser: string },
  ): Promise<void> {
    const { chatId, targetUser } = payload;
    const targetSocket = this.userNameToSocket.get(targetUser);

    if (!targetSocket) {
      return;
    }

    targetSocket.join(chatId);

    if (!this.chatIdToSockets.has(chatId)) {
      this.chatIdToSockets.set(chatId, new Set());
    }
    this.chatIdToSockets.get(chatId)!.add(targetSocket);

    targetSocket.emit(CommonConstants.GatewayConstants.EVENTS.JOIN_NEW_CHAT, {
      chatId,
    });

    this.notifyAddedToChat([targetUser]);
  }

  @SubscribeMessage(CommonConstants.GatewayConstants.EVENTS.LEAVE_CHAT)
  public async handleLeaveChat(
    client: Socket,
    payload: { chatId: string; userName: string },
  ): Promise<void> {
    const { chatId, userName } = payload;
    if (!payload.userName) {
      return;
    }
    const leaveMessage: CreateMessageDto = {
      chatId,
      sender: CommonConstants.GatewayConstants.SYSTEM,
      content: `${userName} has left the chat.`,
    };

    const embeddedMessage =
      await this.chatService.addMessageToChat(leaveMessage);

    const sockets = this.chatIdToSockets.get(chatId);
    if (sockets) {
      const payload = { ...embeddedMessage, chatId };
      sockets.forEach((socket: Socket) => {
        socket.emit(CommonConstants.GatewayConstants.EVENTS.REPLY, payload);
      });
      sockets.delete(client);
    }

    client.leave(chatId);
  }

  @SubscribeMessage(CommonConstants.GatewayConstants.EVENTS.NEW_MESSAGE)
  public async handleNewMessage(
    client: Socket,
    message: CreateMessageDto,
  ): Promise<void> {
    const embeddedMessage = await this.chatService.addMessageToChat({
      chatId: message.chatId,
      sender: message.sender,
      content: message.content,
    } as CreateMessageDto);
    if (!this.chatIdToSockets.has(message.chatId)) {
      this.chatIdToSockets.set(message.chatId, new Set());
    }
    const socketsSet = this.chatIdToSockets.get(message.chatId)!;
    if (!socketsSet.has(client)) {
      socketsSet.add(client);
      client.join(message.chatId);
    }
    const payload = { ...embeddedMessage, chatId: message.chatId };
    socketsSet.forEach((socket: Socket) => {
      socket.emit(CommonConstants.GatewayConstants.EVENTS.REPLY, payload);
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
    client.emit(CommonConstants.GatewayConstants.EVENTS.IS_ONLINE_RESULT, {
      userName: payload.userName,
      isOnline,
    });
  }

  @SubscribeMessage(CommonConstants.GatewayConstants.EVENTS.GET_ONLINE_USERS)
  public handleGetOnlineUsers(
    client: Socket,
    payload: { contacts: string[] },
  ): void {
    const onlineContacts = payload.contacts.filter((contact: string) =>
      this.userNameToSocket.has(contact),
    );
    client.emit(CommonConstants.GatewayConstants.EVENTS.ONLINE_USERS_LIST, {
      onlineContacts,
    });
  }

  @MessagePattern('pop-message')
  handlePopMessage(@Payload() dto: MessageInfoDTO): void {
    if (!dto?.recipients || !Array.isArray(dto.recipients)) {
      console.warn('No recipients provided for pop-message:', dto);
      return;
    }
    dto.recipients.forEach((userName) => {
      const socket = this.userNameToSocket.get(userName);
      if (!socket) {
        console.log(`User ${userName} is not online, cannot send pop-message.`);
        return;
      }
      socket.emit(CommonConstants.GatewayConstants.EVENTS.POP_MESSAGE, {
        chatName: dto.chatName,
        content: dto.content,
      });
    });
  }
}
