import { useRef, useState } from 'react';
import { ChannelType, CreateChannelDto } from '../channel-dto';

interface Props {
    setroom: (roomData: CreateChannelDto) => void;
}

const CreateRoom = ({ setroom }: Props) => {
    const roomNameRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const [roomType, setRoomType] = useState<ChannelType>(ChannelType.PUBLIC); // default to public

    return (
        <div>
            <label>Room Name:</label>
            <input type="text" ref={roomNameRef} />
            
            <label>Room Type:</label>
            <select value={roomType} onChange={(e) => setRoomType(e.target.value as ChannelType)}>
                <option value={ChannelType.PUBLIC}>Public</option>
                <option value={ChannelType.PRIVATE}>Private</option>
                <option value={ChannelType.PROTECTED}>Protected</option>
            </select>

            {roomType === ChannelType.PROTECTED && (
                <>
                    <label>Password:</label>
                    <input type="password" ref={passwordRef} placeholder="Password for protected room" />
                </>
            )}

            <button onClick={() => {
                if (roomNameRef.current?.value) {
                    const roomData = {
                        name: roomNameRef.current.value,
                        type: roomType,
                        password: roomType === ChannelType.PROTECTED ? passwordRef.current?.value : undefined
                    };
                    setroom(roomData);
                }
            }}>Create Room</button>
        </div>
    )
}

export default CreateRoom;
