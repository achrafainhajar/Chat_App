import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import {Server,Socket} from 'socket.io'
@WebSocketGateway({cors:'*'})
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) { }
  @WebSocketServer()
  server:Server;
  @SubscribeMessage('message')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    const message =  await this.messagesService.create(createMessageDto);
    this.findAll();
    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    this.server.emit('find',this.messagesService.findAll())
  }
  @SubscribeMessage('join')
  joinRoom(@MessageBody('name') name:string,@ConnectedSocket() client : Socket) {
      return this.messagesService.identify(name,client.id);
  }
  @SubscribeMessage('typing')
  async typing(@MessageBody() typing:boolean,@ConnectedSocket() client : Socket)
  {
    const name = await this.messagesService.getClientName(client.id);
    client.broadcast.emit('typing', {name,typing});
  }
}
