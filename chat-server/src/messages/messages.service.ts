import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  // database
  messages:Message[] = [{name:"achraf",text:"heyyo"}];
  client_To_user= {};
  create(createMessageDto: CreateMessageDto) {
    return this.messages.push(createMessageDto); // todo improve
  }
  getClientName(client_Id : string)
  {
    return this.client_To_user[client_Id];
  }
  
  findAll() {
    return this.messages;
  }
  identify(name:string,client_Id:string)
  {
    this.client_To_user[client_Id] = name;
    return (Object.values(this.client_To_user));
  }
}
