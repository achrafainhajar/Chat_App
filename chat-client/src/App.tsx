import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import "./assets/ImageBackground.css"
import MessageBg from './components/MessageBg';
import Usersbackground from './components/Usersbackground';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import JoinRoom from './components/JoinRoom';
import CreateRoom from './components/CreateRoom';

export interface Message {
  name: string;
  text: string;
}

const App = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setname] = useState<string>("");
  const [room, setroom] = useState<string>("");
  const socket = io('http://localhost:3000');


  useEffect(() => {
    if(room)
    {
      socket.emit('createRoom', { roomname: room });
    }
  }, [room])
  useEffect(() => {
    if (room !== "") {
      socket.emit('findAllMessages', { roomname: room });
      socket.on('find', (allMessages) => {
        console.log(allMessages)
        setMessages(allMessages);
      });
    }
  }, [room]);

  useEffect(() => {
    if (message !== "") {
      socket.emit('message', { name: name, text: message, roomname: room});
      setMessage("");
    }
  }, [message]);

  const onSend = (msg: string) => {
    setMessage(msg);
  }

  return (
    <div className='background-image'>
      {!name && <JoinRoom setname={setname} />}
      {!room && <CreateRoom setroom={setroom} />}
      {name && room &&
        <>
          <Usersbackground>
          </Usersbackground>
          <MessageBg>
            <MessageList messages={messages} />
            <MessageInput onSend={onSend} />
          </MessageBg>
        </>
      }
    </div>

  );
};

export default App;
