import "../assets/MessageBg.css"
import "../assets/ImageBackground.css"
import { Props } from "./Usersbackground"
const MessageBg = ({ children }: Props) => {
  return (
    <div className="MessageBg">
      {children}
    </div>
  )
}

export default MessageBg