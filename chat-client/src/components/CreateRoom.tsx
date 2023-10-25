import React, { useRef } from 'react'


interface Props {
    setroom: (name :string) => (void);
}
const CreateRoom = ({ setroom }: Props) => {
    const uname = useRef<HTMLInputElement | null>(null);
    return (
        <div>
            <input type="text" ref={uname} />
            <button onClick={() => {
                if (uname.current !== null && uname.current.value) {
                    setroom(uname.current.value);
                }
            }}>CreateRoom</button>
        </div>
    )
}

export default CreateRoom