import "../../dist/output.css"
import "../assets/InputBar.css"
import "../assets/ImageBackground.css"
import { useRef } from "react";

interface Props
{
    onSend: (msg: string) => (void);
}

const MessageList = ({ onSend }: Props) => {

    const msg = useRef(null);
    return (
        <div className="max-w-full max-h-full">
            <input type="text" ref={msg} className="input-bar" />
            <button onClick={() => {
                if (msg.current !== null && msg.current.value)
                {
                    onSend(msg.current.value);
                    msg.current.value = "";
                }
            }} className="button-image" />
        </div>
    )
}

export default MessageList