import { useEffect, useRef, useState } from 'react';
import {io,Socket}from 'socket.io-client';
import "./assets/ImageBackground.css"
import MessageBg from './components/MessageBg';
import Usersbackground from './components/Usersbackground';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import JoinRoom from './components/JoinRoom';
import CreateRoom from './components/CreateRoom';
import { ChannelType, CreateChannelDto } from './channel-dto';
import ShowRooms from './components/ShowRooms';
import ShowMembers from './components/ShowMembers';


export interface Rooms
{
  message: Message[];
  room_name: string;
  type: ChannelType;
  password?: string;
}

export interface Message {
  name: string;
  text: string;
}
export enum MemberStatus {
  OWNER = 'Owner',
  ADMIN = 'Admin',
  MEMBER = 'Member',
}

export interface Member {
  id: string;
  username: string;
  status: MemberStatus;
  mutedEndTime: Date;
}

const App = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setname] = useState<string>("");
  const [room, setroom] = useState<CreateChannelDto>({name:"",type:ChannelType.PUBLIC});
  const [rooms, setrooms] = useState<CreateChannelDto[]>([]);
  const [join,setjoin]  = useState<string>("");
  const [members,setMembers] = useState<Member[] | null>(null)
  const [member,setMember] = useState<Member | null>(null)
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io('http://localhost:3000');

    return () => {
      socket.current?.disconnect();
    };
  }, []);
  useEffect(() => {
    if (room.name) {
      if(socket.current)
        socket.current.emit('createRoom', {name,room});
    }
  }, [room]);
  useEffect(() => {
    if (join) {
      if(socket.current)
      {
        if(room.name)
          socket.current?.emit('leaveRoom', room.name);
        socket.current.emit('joinroom', {name:name,roomname:join});
        socket.current.on("kicked",()=>
          {
            setjoin("");
            setroom({name:"",type:ChannelType.PUBLIC});
            setMessages([]);
            setMembers(null);
          }
        )
      }
      room.name = join;
    }
  }, [join]);
  useEffect(() => {
    const mapRoomsToDto = (room: Rooms): CreateChannelDto => {
      return {
        name: room.room_name,
        type: room.type,
        password: room.password,
      };
    };

    socket.current?.emit('ShowRooms');

    const handleShowrooms = (data:any) => {
      const mappedRooms = data.map(mapRoomsToDto);
      setrooms(mappedRooms);
    };

    socket.current?.on("showrooms", handleShowrooms);

    return () => {
      socket.current?.off("showrooms", handleShowrooms);
    };
  }, []);

  useEffect(() => {
    let data: string | null = null;
    if(room)
    {
        data = room.name;
    }
    if (data) {
      socket.current?.emit('findAllMessages', { roomname: data });
      const handleFind = (allMessages:any) => {

        setMessages(allMessages);
      };
      socket.current?.on('find', handleFind);

      return () => {
        socket.current?.off('find', handleFind);
      };
      setjoin("");
    } 
  }, [room,join]);
  useEffect(() => {
    if (!name || !room?.name) {
      return;
    }
    const handleGetRoomMembers = (data: Member[]) => {
        setMembers(data);
    };
    socket.current?.emit('getRoomMembers', join);
    socket.current?.on('getroomMembers', handleGetRoomMembers);
    socket.current?.on('getMyMember',(data:Member)=>{
      console.log(data);
      setMember(data);
    })
    return () => {
      socket.current?.off('getroomMembers', handleGetRoomMembers);
    };
  }, [join]);

  useEffect(() => {
    if (message !== "") {
      socket.current?.emit('message', { name: name, text: message, roomname: room?.name });
      setMessage("");
    }
  }, [message]);

  const onSend = (msg: string) => {
    setMessage(msg);
  };

  return (
    <div className='background-image'>
      {!name && <JoinRoom setname={setname} />}
      {name &&
        <>
          <CreateRoom setroom={setroom} />
          <Usersbackground>
            <ShowRooms rooms={rooms} setjoin={setjoin}/>
          </Usersbackground>
          <MessageBg>       
            <MessageList messages={messages} />
            <MessageInput onSend={onSend} />
            <ShowMembers me={member} members={members} socket={socket.current}  room={room}/>
          </MessageBg>
        </>
      }
    </div>
  );
};

export default App;
