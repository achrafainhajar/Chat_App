import  { useRef } from 'react';

interface Props {
    setname: (name: string) => void; 
}

const JoinRoom = ({ setname }: Props) => {
    const uname = useRef<HTMLInputElement | null>(null);

    return (
        <div>
            <input type="text" ref={uname} />
            <button onClick={() => {
                if (uname.current !== null && uname.current.value) {
                    setname(uname.current.value);
                }
            }}>Send</button>
        </div>
    );
};

export default JoinRoom;
