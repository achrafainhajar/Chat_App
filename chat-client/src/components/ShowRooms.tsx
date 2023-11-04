import { CreateChannelDto } from '../channel-dto'
import "../assets/MessageList.css"
import "../assets/Roomslist.css"
export interface Props {
  rooms: CreateChannelDto[];
  setjoin : (roomData:string) => (void);
}

const ShowRooms = ({ rooms,setjoin }: Props) => {
  return (
    <div className="list">
      <ul>
        {rooms.map((room) => <li key={room.name}><div className='square'><button className='room' onClick={()=>{ setjoin(room.name)}}> {room.name} </button></div></li>)}
      </ul>
    </div>
  )
}

export default ShowRooms;
