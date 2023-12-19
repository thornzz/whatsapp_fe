import { useState, useEffect,useRef } from "react";
import { useSelector } from "react-redux";
import SocketContext from "../../../context/SocketContext";

function Input({ message, setMessage, textRef, socket }) {
  const { activeConversation } = useSelector((state) => state.chat);
  const [typing, setTyping] = useState(false);
  const typingTimer = useRef(null); // useRef hook'unu kullanarak typingTimer değişkenini tanımlayın
  const onChangeHandler = (e) => {
    setMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      console.log('typing true oldu');
      socket.emit("typing", activeConversation._id);
    }

    // Eğer bir zamanlayıcı zaten çalışıyorsa, yeni bir tane başlatma
    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
    }

    // Zamanlayıcıyı başlat
    typingTimer.current = setTimeout(stopTyping, 2000);
  };

  const stopTyping = () => {
    console.log('stop typing tetiklendi');
    socket.emit("stop typing", activeConversation._id);
    setTyping(false);
    typingTimer.current = null; // Zamanlayıcıyı sıfırla
  };

  useEffect(() => {
    return () => {
      // Komponent unmount olduğunda zamanlayıcıyı temizle
      clearTimeout(typingTimer.current);
    };
  }, []);

  return (
    <div className="w-full">
      <input
        type="text"
        className="dark:bg-dark_hover_1 dark:text-dark_text_1 outline-none h-[45px] w-full flex-1 rounded-lg pl-4"
        placeholder="Mesaj yaz"
        value={message}
        onChange={onChangeHandler}
        ref={textRef}
      />
    </div>
  );
}

const InputWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Input {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default InputWithSocket;
