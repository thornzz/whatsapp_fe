import { useSelector, useDispatch } from "react-redux";
import { DotsIcon, SearchLargeIcon } from "../../../svg";
import { capitalize } from "../../../utils/string";
import { useEffect, useRef, useState } from "react";
import SocketContext from "../../../context/SocketContext";
import Peer from "simple-peer";
import {
  getConversationName,
  getConversationNamePhoneNumber,
  getConversationPicture,
} from "../../../utils/chat";
import { RiFileCloseFill } from "react-icons/ri";
import {
  closeConversation,
  removeClosedConversation,
  setActiveConversation,
} from "../../../features/chatSlice";

function ChatHeader({ online, callUser, socket }) {
  const { activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const dispatch = useDispatch();
  const values = {
    convo_id: activeConversation?._id,
    token,
  };

  const closeConversationHandler = async (e) => {
    e.preventDefault();
    dispatch(closeConversation(values));
    dispatch(removeClosedConversation(activeConversation));
    dispatch(setActiveConversation({}));

    //socket.emit("join conversation", newConvo.payload._id);
  };
  return (
    <div className="h-[59px] dark:bg-dark_bg_2 flex items-center p16 select-none">
      {/*Container*/}
      <div className="w-full flex items-center justify-between">
        {/*left*/}
        <div className="flex items-center gap-x-4">
          {/*Conversation image*/}
          <button className="btn">
            <img
              src={
                activeConversation.isGroup
                  ? activeConversation.picture
                  : getConversationPicture(user, activeConversation.users)
              }
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          </button>
          {/*Conversation name and online status*/}
          <div className="flex flex-col">
            <h1 className="dark:text-white text-md font-bold">
              {/* {activeConversation.isGroup
                ? activeConversation.name
                : capitalize(
                    getConversationName(user, activeConversation.users).split(
                      " "
                    )[0]
                  )} */}
              {getConversationNamePhoneNumber(user, activeConversation.users)}
            </h1>
            <span className="text-xs dark:text-dark_svg_2">
              {online ? "Çevrimiçi" : ""}
            </span>
          </div>
        </div>
        {/*Right*/}
        <ul className="flex items-center gap-x-2.5">
          {/* {1 == 1 ? (
            <li onClick={() => callUser()}>
              <button className="btn">
                <VideoCallIcon />
              </button>
            </li>
          ) : null}
          {1 == 1 ? (
            <li>
              <button className="btn">
                <CallIcon />
              </button>
            </li>
          ) : null} */}
          <li>
            <button className="btn">
              <SearchLargeIcon className="dark:fill-dark_svg_1" />
            </button>
          </li>
          <li>
            <button
              className="btn"
              onClick={(e) => closeConversationHandler(e)}
            >
              <RiFileCloseFill className="dark:fill-dark_svg_1 w-5 h-5" />
            </button>
          </li>
          <li>
            <button className="btn">
              <DotsIcon className="dark:fill-dark_svg_1" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

const ChatHeaderWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatHeader {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default ChatHeaderWithSocket;
