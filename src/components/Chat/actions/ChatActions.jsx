// import SocketContext from "../../../context/SocketContext";
import { sendMessage } from "../../../features/chatSlice";
import { SendIcon } from "../../../svg";
import { Attachments } from "./attachments";
import EmojiPickerApp from "./EmojiPicker";
import Input from "./Input";
import { useClickOutside } from "@mantine/hooks";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useSocketContext } from "../../../context/SocketProvider";

export default function ChatActions() {
  const dispatch = useDispatch();
  const socket = useSocketContext();
  const [showPicker, setShowPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const refShowPicker = useClickOutside(() => setShowPicker(false));
  const textRef = useRef();

  const { activeConversation, status } = useSelector((state) => state.chat);
  const {
    user: { token },
  } = useSelector((state) => state.user);

  const sendMessageHandler = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      const values = {
        waba_user_phonenumber: activeConversation?.users[0]?.phonenumber,
        message,
        convo_id: activeConversation._id,
        files: [],
        token,
      };

      const newMsg = await dispatch(sendMessage(values));
      socket.emit("send message", newMsg.payload);

      setMessage("");
      setLoading(false);
    },
    [dispatch, message, activeConversation, token, socket]
  );

  const isConversationClosed = activeConversation?.closed;
  const isSendingMessage = status === "pending" && loading;

  return (
    <>
      <form
        onSubmit={sendMessageHandler}
        className={`dark:bg-dark_bg_2 h-[60px] w-full flex items-center absolute bottom-0 py-2 px-4 select-none `}
      >
        <div
          className={`w-full flex items-center gap-x-2 ${
            isConversationClosed ? "hidden" : ""
          }`}
        >
          <ul className="flex gap-x-2" ref={refShowPicker}>
            <EmojiPickerApp
              textRef={textRef}
              message={message}
              setMessage={setMessage}
              showPicker={showPicker}
              setShowPicker={setShowPicker}
              setShowAttachments={setShowAttachments}
            />
            <Attachments />
          </ul>
          <Input message={message} setMessage={setMessage} textRef={textRef} />
          <button type="submit" className="btn">
            {isSendingMessage ? (
              <ClipLoader color="#E9EDEF" size={25} />
            ) : (
              <SendIcon className="dark:fill-dark_svg_1" />
            )}
          </button>
        </div>
        {isConversationClosed && (
          <div className="w-full flex items-center gap-x-2 justify-center">
            <p className="text-amber-50">SOHBET SONLANDIRILDI</p>
          </div>
        )}
      </form>
    </>
  );
}
