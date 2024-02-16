import { Button, Flex, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconInfoSquareFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ChatContainer, WhatsappHome } from "../components/Chat";
import { Sidebar } from "../components/sidebar";
import SocketContext from "../context/SocketContext";
import {
  getConversations,
  updateMessagesAndConversations,
  updateStatues,
} from "../features/chatSlice";
import { logout } from "../features/userSlice";

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
    return () => {
      socket.off("get-online-users");
    };
  }, []);
  useEffect(() => {
    if (!socket.connected) socket.connect();
    const { token, ...userWithoutToken } = user;
    const userwithUserId = { userId: user._id, user: userWithoutToken };
    socket.emit("join", userwithUserId);
    // socket.on("connect", () => {
    //   console.log("tekrar bağlandık");
    //   socket.emit("join", userwithUserId);
    // });
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
      dispatch(updateMessagesAndConversations(message));
    });
    socket.on("update statues", (message) => {
      //console.log('receive message tetiklendi',message);
      dispatch(updateStatues(message));
    });
    // socket.on("group created", () => {
    //   if (user?.token) {
    //     dispatch(getConversations(user.token));
    //   }
    // });
    socket.on("existing_user", () => {
      console.log("existing_user tetiklendi");
      socket.emit("logout", { ...user, socketId: socket.id });
      socket.disconnect();
      dispatch(logout());
      notifications.show({
        color: "#00A884",
        position: "center",
        title: "Yeni oturum",
        message: "Farklı bir yerden oturum açtınız.",
        autoClose: 4000,
        styles: {
          body: { backgroundColor: "#202C33" },
          root: { backgroundColor: "#202C33" },
        },
      });
      // dispatch(updateMessagesAndConversations(message));
    });
    socket.on("notify_transfer_message", (transferrerUser) => {
      dispatch(getConversations(user.token));
      modals.open({
        centered: true,
        title: "Transfer edilen mesaj",
        size: "md",
        withCloseButton: false,

        children: (
          <>
            <Flex
              gap="xs"
              justify="center"
              align="center"
              direction="row"
              wrap="nowrap"
            >
              <IconInfoSquareFilled size={24} color="#00A884" />
              <Text size="sm">
                {transferrerUser.name} tarafından size bir sohbet transfer
                edildi.
              </Text>
            </Flex>
            <Button
              fullWidth
              onClick={() => modals.closeAll()}
              mt="md"
              color="#00A884"
            >
              Onayla
            </Button>
          </>
        ),
      });
    });
    socket.on("disconnect", () => {
      console.log("disconnect tetiklendi");
      socket.emit("logout", { ...user, socketId: socket.id });
      dispatch(logout());
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

    return () => {
      // Event listenelar kaldırılıyor
      socket.off("receive message");
      socket.off("update statues");
      socket.off("existing_user");
      socket.off("disconnect");
      socket.off("incoming-waba-status");
      socket.off("incoming-waba-message");
    };
  }, []);

  return (
    <>
      {/* <Spotlight
        nothingFound="Nothing found..."
        actions={actions}
        highlightQuery
        searchProps={{
          leftSection: (
            <IconSearch
              style={{ width: rem(20), height: rem(20) }}
              stroke={1.5}
            />
          ),
          placeholder: "Search...",
        }}
      /> */}
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
