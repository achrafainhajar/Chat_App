import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import "./assets/ImageBackground.css"
import MessageBg from './components/MessageBg';
import Usersbackground from './components/Usersbackground';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';

export interface Message {
  name: string;
  text: string;
}

const App = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = io('http://localhost:3000');

  useEffect(() => {
    socket.emit('findAllMessages');
    socket.on('find', (allMessages) => {
      setMessages(allMessages);
    });

    // No need to disconnect here; it should be in the cleanup function of the other useEffect.
  }, []);

  useEffect(() => {
    if (message !== "") {
      socket.emit('message', { name: "toto", text: message });
      setMessage("");
    }
  }, [message]);

  const onSend = (msg: string) => {
    setMessage(msg);
  }

  return (
    <div className='background-image'>
      <Usersbackground>
      </Usersbackground>
      <MessageBg>
        <MessageList messages={messages}/>
        <MessageInput onSend={onSend}/>
      </MessageBg>
    </div>

  );
};

export default App;
