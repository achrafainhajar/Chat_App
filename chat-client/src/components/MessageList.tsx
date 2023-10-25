import React from 'react'
import { Message } from '../App';
import "../assets/MessageList.css"
interface Props {
  messages: Message[];
}
const MessageList = ({ messages }: Props) => {
  return (
    <>
      <div className='list'>
        <ul>

          {messages.map((item, index) => <li key={index} >{item.name}  ::  {item.text}</li>)}

        </ul>
      </div>
    </>
  )
}

export default MessageList