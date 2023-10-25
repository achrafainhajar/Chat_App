export class Message
{
    name:string;
    text:string;
}

export class Rooms {
    message: Message[] = [{ name: "achraf", text: "h" }];
    room_name: string;
  
    constructor(room_n: string) {
      this.room_name = room_n;
    }
  }
  