import { Button, rem } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ChatContainer, WhatsappHome } from "../components/Chat";
import { Sidebar } from "../components/sidebar";
import SocketContext from "../context/SocketContext";
import {
  getConversations,
  sendMessage,
  updateMessagesAndConversations,
  updateStatues,
} from "../features/chatSlice";

function Home({ socket }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  const [onlineUsers, setOnlineUsers] = useState([]);

  //typing
  // const [typing, setTyping] = useState(false);
  //join user into the socket io

  useEffect(() => {
    //get online users
    socket.on("get-online-users", (users) => {
      console.log(users, "get online users");
      setOnlineUsers(users);
    });
  }, []);
  useEffect(() => {
    if (!socket.connected) socket.connect();
    const { token, ...userWithoutToken } = user;
    const userwithUserId = { userId: user._id, user: userWithoutToken };
    socket.emit("join", userwithUserId);
    socket.on("connect", () => {
      console.log("tekrar bağlandık");
      socket.emit("join", userwithUserId);
    });
  }, []);

  //get Conversations
  useEffect(() => {
    if (user?.token) {
      dispatch(getConversations(user.token));
    }
  }, []);

  useEffect(() => {
    //lsitening to receiving a message
    socket.on("receive message", (message, userId) => {
      //console.log(message);
      dispatch(updateMessagesAndConversations(message));
    });
    socket.on("update statues", (message) => {
      //console.log('receive message tetiklendi',message);
      dispatch(updateStatues(message));
    });
    socket.on("group created", () => {
      if (user?.token) {
        dispatch(getConversations(user.token));
      }
    });
    //listening when a user is typing
    // socket.on("typing", (conversation) => setTyping(conversation));
    // socket.on("stop typing", () => setTyping(false));

    //incoming waba message
    socket.on("incoming-waba-message", async ({ message }) => {
      socket.emit("incoming-waba-message-server", {
        message,
        userId: user._id,
      });
    });
    //incoming waba message
    socket.on("incoming-waba-status", async ({ message }) => {
      socket.emit("incoming-waba-statues-server", {
        message,
        userId: user._id,
      });
    });
  }, []);

  return (
    <>
      <div className="h-screen w-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
        {/*container*/}
        <div className="container h-screen w-screen flex py-[19px]">
          {/*Sidebar*/}
          {/* <Sidebar onlineUsers={onlineUsers} typing={typing} /> */}
          <Sidebar onlineUsers={onlineUsers} socket={socket} />
          {activeConversation._id ? (
            <ChatContainer
              onlineUsers={onlineUsers}
              // callUser={callUser}
            />
          ) : (
            //  <ChatContainer
            //   onlineUsers={onlineUsers}
            //   // callUser={callUser}
            //   typing={typing}
            // />
            <WhatsappHome />
          )}
        </div>
      </div>
    </>
  );
}

const HomeWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default HomeWithSocket;
