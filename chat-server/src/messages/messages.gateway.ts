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
    this.findAll(createMessageDto.roomname);
    return message;
  }
  @SubscribeMessage('createRoom')
  createRoom(@ConnectedSocket() socket: Socket, @MessageBody() data: { roomname: string }) {
    socket.join(data.roomname);
    socket.to(data.roomname).emit('roomCreated', { room: data.roomname });
    this.messagesService.createRoom(data.roomname);
    return { room: data.roomname};
  }
  @SubscribeMessage('findAllMessages')
  findAllMessagesByRoom(@MessageBody() createMessageDto:CreateMessageDto)
  {
    this.findAll(createMessageDto.roomname);
  }
  findAll(room_name:string) {
    this.server.to(room_name).emit('find',this.messagesService.findAll(room_name))
  }
  @SubscribeMessage('join')
  joinRoom(@MessageBody('name') name:string,@ConnectedSocket() client : Socket) {
      return this.messagesService.identify(name,client.id);
  }
}
