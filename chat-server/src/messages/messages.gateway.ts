import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io'
import { CreateChannelDto, Props } from './dto/channel-type.dto';
import { Member, MemberStatus } from './entities/message.entity';
@WebSocketGateway({ cors: '*' })
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) { }
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('message')
  async create(@ConnectedSocket() socket: Socket, @MessageBody() createMessageDto: CreateMessageDto) {
    try {
      if (this.messagesService.findRoomByName(createMessageDto.roomname).isMemberMuted(socket.id) === false) {
        const message = await this.messagesService.addMessage(createMessageDto);
        this.findAll(createMessageDto.roomname);
        return message;
      }
    } catch (error) {
      console.error("Error processing 'message'", error);
    }
  }

  @SubscribeMessage('createRoom')
  createRoom(@ConnectedSocket() socket: Socket, @MessageBody() prop: Props) {
    this.messagesService.addRoom(prop.room, socket, prop.name);
    return { room: prop.room.name, type: prop.room.type };
  }
  @SubscribeMessage('ShowRooms')
  showRooms() {
    const rooms = this.messagesService.getAllRooms();  // fetch rooms using the hypothetical service
    this.server.emit('showrooms', rooms);
  }
  @SubscribeMessage('findAllMessages')
  findAllMessagesByRoom(@MessageBody() createMessageDto: CreateMessageDto) {
    this.findAll(createMessageDto.roomname);
  }
  findAll(room_name: string) {
    this.server.to(room_name).emit('find', this.messagesService.getMessagesByRoomName(room_name))
    this.showRooms();
  }
  @SubscribeMessage('joinroom')
  joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() { name, roomname }) {
    const room = this.messagesService.findRoomByName(roomname);
    if (room && !room.getBanned().find((member) => member === socket.id)) {
      const member = new Member(socket.id, name, MemberStatus.MEMBER, new Date());
      room.addMember(member);
      socket.join(roomname);
    }
    else {
      socket.emit('kicked');
    }
  }
  @SubscribeMessage('getRoomMembers')
  getRoomMembers(@ConnectedSocket() socket: Socket, @MessageBody() roomname: string) {
    const room = this.messagesService.findRoomByName(roomname);
    try {
      this.server.to(roomname).emit("getroomMembers", room.getMembers());
      socket.emit("getMyMember", room.getMyMember(socket.id));
    }
    catch
    {
      console.log("khsrt")
    }
  }
  @SubscribeMessage('join')
  join(@MessageBody('name') name: string, @ConnectedSocket() client: Socket) {
    return this.messagesService.identifyClient(name, client.id);
  }
  @SubscribeMessage('Kick')
  kickMember(@ConnectedSocket() socket: Socket, @MessageBody() data: { roomName: string, memberId: string }) {
    const room = this.messagesService.findRoomByName(data.roomName);
    room.kickMember(data.memberId);
    this.server.sockets.sockets.get(data.memberId)?.leave(data.roomName);
    this.server.to(data.memberId).emit('kicked');
    this.server.to(data.roomName).emit('getroomMembers', room.getMembers());
  }
  @SubscribeMessage('Ban')
  banMember(@ConnectedSocket() socket: Socket, @MessageBody() data: { roomName: string, memberId: string }) {
    const room = this.messagesService.findRoomByName(data.roomName);
    room.banMember(data.memberId);
  }
  @SubscribeMessage('Mute')
  muteMember(@ConnectedSocket() socket: Socket, @MessageBody() data: { roomName: string, memberId: string }) {
    const room = this.messagesService.findRoomByName(data.roomName);
    room.muteMember(data.memberId,1);
  }
  @SubscribeMessage('setAdmin')
  setAdmin(@MessageBody() data: { memberId: string; roomName: string }, @ConnectedSocket() socket: Socket) {
    try {

      const room = this.messagesService.findRoomByName(data.roomName);
      room.setAdmin(data.memberId);
      // Inform clients in the room about the admin status change
      this.server.to(data.roomName).emit("getroomMembers", room.getMembers());
      this.server.to(data.memberId).emit("getMyMember",room.getMyMember(data.memberId))
    }
    catch (error) {
      console.error("Error processing 'setAdmin'", error);
    }
  }

  @SubscribeMessage('unsetAdmin')
  unsetAdmin(@MessageBody() data: { memberId: string; roomName: string }, @ConnectedSocket() socket: Socket) {
    try {

      const room = this.messagesService.findRoomByName(data.roomName);
      room.unsetAdmin(data.memberId);
      // Inform clients in the room about tdhe admin status change
      this.server.to(data.roomName).emit('getroomMembers', room.getMembers());
      this.server.to(data.memberId).emit("getMyMember",room.getMyMember(data.memberId))
    }
    catch (error) {
      console.error("Error processing 'setAdmin'", error);
    }
  }
}
