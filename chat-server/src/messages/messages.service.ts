import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message, Rooms } from './entities/message.entity';

@Injectable()
export class MessagesService {
  // database
  room: Rooms[] = [];
  client_To_user = {};
  create(createMessageDto: CreateMessageDto) {
    try
    {
      return this.room.find(room => room.room_name === createMessageDto.roomname).message.push(createMessageDto);
    }
    catch
    {
        return []
    }
  }
  getClientName(client_Id: string) {
    return this.client_To_user[client_Id];
  }
  createRoom(room_name: string) {
    const tmp_room = new Rooms(room_name);
    console.log(tmp_room)
    this.room.push(tmp_room);
  }
  findAll(roomname: string) {
    let messages;
    try {
      messages = this.room.find(room => 
      room.room_name === roomname);
      console.log(messages.message);
      return(messages.message);
    }
    catch
    {
      console.log("khsr");
      return ([]);
    }
  }
  identify(name: string, client_Id: string) {
    this.client_To_user[client_Id] = name;
    return (Object.values(this.client_To_user));
  }
}
