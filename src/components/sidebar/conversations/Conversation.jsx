import { useDispatch, useSelector } from "react-redux";
import { useSocketContext } from "../../../context/SocketProvider";
import { open_create_conversation } from "../../../features/chatSlice";
import {
  getConversationId,
  getConversationName,
  getConversationPicture,
} from "../../../utils/chat";
import { dateHandler } from "../../../utils/date";
import { capitalize } from "../../../utils/string";
import { IconMessageOff } from "@tabler/icons-react";

export default function Conversation({ convo, online }) {
  const dispatch = useDispatch();
  const socket = useSocketContext();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);

  const openConversation = async () => {
    const values = {
      receiver_id: getConversationId(user, convo.users),
      isGroup: convo.isGroup ? convo._id : false,
      token: user.token,
      closed: convo.closed,
    };
    const newConvo = await dispatch(open_create_conversation(values));
    socket.emit("join conversation", newConvo.payload._id);
  };

  const getLatestMessage = () => {
    const { latestMessage } = convo;
    if (latestMessage.files.length > 0) {
      if (latestMessage.type === "cloudinary") {
        return (
          latestMessage.files[0].file.original_filename +
          "." +
          latestMessage.files[0].type.toLowerCase()
        );
      } else if (
        latestMessage.type === "waba" &&
        latestMessage.files[0].file.type === "document"
      ) {
        return latestMessage.files[0].file.filename;
      } else if (
        latestMessage.type === "waba" &&
        latestMessage.files[0].file.type === "image"
      ) {
        return "[Resim dosyası]";
      }
    }
    return latestMessage?.message.length > 25
      ? `${latestMessage?.message.substring(0, 25)}...`
      : latestMessage?.message;
  };

  const isActive = convo._id === activeConversation._id;
  const isClosed = convo.closed;
  const latestMessage = getLatestMessage();
  const conversationName = convo.isGroup
    ? convo.name
    : capitalize(getConversationName(user, convo.users));

  return (
    <li
      onClick={openConversation}
      className={`list-none h-[72px] w-full dark:bg-dark_bg_1 hover:${
        !isActive ? "dark:bg-dark_bg_2" : ""
      } cursor-pointer dark:text-dark_text_1 px-[10px] ${
        isActive ? "dark:bg-dark_hover_1" : ""
      }`}
    >
      <div className="relative w-full flex items-center justify-between py-[10px]">
        <div className="flex items-center gap-x-3">
          <div
            className={`relative min-w-[50px] max-w-[50px] h-[50px] rounded-full overflow-hidden ${
              online ? "online" : ""
            }`}
          >
            <img
              src={
                convo.isGroup
                  ? convo.picture
                  : getConversationPicture(user, convo.users)
              }
              alt="convo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full flex flex-col">
            <h1 className="font-bold flex items-center gap-x-2">
              {conversationName}
            </h1>
            <div>
              <div className="flex items-center gap-x-1 dark:text-dark_text_2">
                <p className="flex-1 items-center gap-x-1 dark:text-dark_text_2">
                  {latestMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-y-4 items-end text-xs">
          {isClosed ? (
            <IconMessageOff
              style={{ width: "80%", height: "80%" }}
              stroke={1.5}
            />
          ) : (
            <span className="dark:text-dark_text_2">
              {dateHandler(convo.latestMessage?.createdAt)}
            </span>
          )}
        </div>
      </div>
      <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
    </li>
  );
}
