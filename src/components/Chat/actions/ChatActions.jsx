import SocketContext from "../../../context/SocketContext";
import { sendMessage } from "../../../features/chatSlice";
import { SendIcon } from "../../../svg";
import { Attachments } from "./attachments";
import EmojiPickerApp from "./EmojiPicker";
import Input from "./Input";
import { useClickOutside } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

function ChatActions({ socket }) {
  const dispatch = useDispatch();
  const [showPicker, setShowPicker] = useState(false);
  const refShowPicker = useClickOutside(() => setShowPicker(false));
  const [showAttachments, setShowAttachments] = useState(false);
  const [loading, setLoading] = useState(false);
  const { activeConversation, status } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [message, setMessage] = useState("");
  const textRef = useRef();
  const values = {
    waba_user_phonenumber: activeConversation?.users[0]?.phonenumber,
    message,
    convo_id: activeConversation._id,
    files: [],
    token,
  };
  const SendMessageHandler = async (e) => {
    e.preventDefault();
    console.log(activeConversation.users);
    setLoading(true);
    let newMsg = await dispatch(sendMessage(values));
    socket.emit("send message", newMsg.payload);
    setMessage("");
    setLoading(false);
  };
  return (
    <form
      onSubmit={(e) => SendMessageHandler(e)}
      className="dark:bg-dark_bg_2 h-[60px] w-full flex items-center absolute bottom-0 py-2 px-4 select-none"
    >
      {/*Container*/}
      <div
        className={`w-full flex items-center gap-x-2 
     ${activeConversation.closed ? "hidden" : ""}
     `}
      >
        {/*Emojis and attachpments*/}
        <ul className="flex gap-x-2" ref={refShowPicker}>
          <EmojiPickerApp
            textRef={textRef}
            message={message}
            setMessage={setMessage}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
            setShowAttachments={setShowAttachments}
          />
          {/* <Attachments
            showAttachments={showAttachments}
            setShowAttachments={setShowAttachments}
            setShowPicker={setShowPicker}
          /> */}
          <Attachments />
        </ul>
        {/*Input*/}
        <Input message={message} setMessage={setMessage} textRef={textRef} />
        {/*Send button*/}
        <button type="submit" className="btn">
          {status === "pending" && loading ? (
            <ClipLoader color="#E9EDEF" size={25} />
          ) : (
            <SendIcon className="dark:fill-dark_svg_1" />
          )}
        </button>
      </div>
      <div
        className={`w-full flex items-center gap-x-2 justify-center  ${
          !activeConversation?.closed ? "hidden" : ""
        }`}
      >
        <p className="text-amber-50">SOHBET SONLANDIRILDI</p>
      </div>
    </form>
  );
}

const ChatActionsWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatActions {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default ChatActionsWithSocket;
