import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Member, MemberStatus, Message, Rooms } from './entities/message.entity';
import { CreateChannelDto } from './dto/channel-type.dto';
import { Socket } from 'socket.io';

@Injectable()
export class MessagesService {
  
  private rooms: Rooms[] = [];
  private clientToUserMap: { [clientId: string]: string } = {};

  addMessage(createMessageDto: CreateMessageDto): Message[] | null {
    const targetRoom = this.rooms.find(room => room.room_name === createMessageDto.roomname);
    if (!targetRoom) {
      console.error('Room not found!');
      return null;
    }
    targetRoom.message.push(createMessageDto);
    return targetRoom.message;
  }

  getClientName(clientId: string): string | undefined {
    return this.clientToUserMap[clientId];
  }

  addRoom(channel: CreateChannelDto,socket:Socket,name:string): void {
    const existingRoom = this.rooms.find(room => room.room_name === channel.name);
    if (existingRoom) {
      console.error('Room already exists!');
      return;
    }
    const newRoom = new Rooms(channel.name, channel.type, channel.password);
    const member = new Member(socket.id,name,MemberStatus.OWNER,new Date());
    newRoom.addMember(member);
    this.rooms.push(newRoom);
  }

  getAllRooms(): Rooms[] | null {
    return this.rooms.length ? this.rooms : null;
  }

  getMessagesByRoomName(roomname: string): Message[] {
    const targetRoom = this.rooms.find(room => room.room_name === roomname);
    if (!targetRoom) {
      console.error('Room not found!');
      return [];
    }
    return targetRoom.message;
  }
  findRoomByName(name: string): Rooms | null {
    return this.rooms.find(room => room.room_name === name) || null;
  }
  identifyClient(name: string, clientId: string): string[] {
    this.clientToUserMap[clientId] = name;
    return Object.values(this.clientToUserMap);
  }
}
