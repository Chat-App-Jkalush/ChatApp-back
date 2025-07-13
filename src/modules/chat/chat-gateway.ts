import { WebSocketGateway } from '@nestjs/websockets';
import { DEFAULT_PORT } from 'src/constants/gateway.contants';

@WebSocketGateway(DEFAULT_PORT, {})
export class ChatGateway {}
