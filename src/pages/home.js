import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatContainer, WhatsappHome } from "../components/Chat";
import { Sidebar } from "../components/sidebar";
import { useSocketContext } from "../context/SocketProvider";
import { getConversations } from "../features/chatSlice";
import { useSocket } from "../hooks/useSocket";
import { useAxiosInterceptor } from "../hooks/useAxiosInterceptor";
import { logout } from "../features/userSlice";
import { notifications } from "@mantine/notifications";
import { axiosPrivate } from "../utils/axiosprivate";

export default function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  const socket = useSocketContext();
  const [onlineUsers] = useSocket(socket, user);
  const [isCookieExpired] = useAxiosInterceptor();

  const isSmScreen = window.innerWidth < 640;

  useEffect(() => {
    if (user) {
      dispatch(getConversations());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (isCookieExpired) {
      dispatch(logout());
      axiosPrivate.post("/auth/logout");
      socket.emit("logout", { ...user, socketId: socket.id });
      socket.disconnect();

      notifications.show({
        color: "red",
        position: "center",
        title: "Oturum zaman aşımı",
        message: "Lütfen tekrar giriş yapın.",
        autoClose: 4000,
        styles: {
          body: { backgroundColor: "#202C33" },
          root: { backgroundColor: "#202C33" },
        },
      });
    }
  }, [isCookieExpired, socket, dispatch, user]);

  const chatContainer = activeConversation._id ? (
    <ChatContainer onlineUsers={onlineUsers} />
  ) : (
    <WhatsappHome />
  );

  return (
    <div className="h-screen w-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <div className="container h-screen w-screen flex flex-col sm:flex-row sm:py-[17px]">
        {/* <Burger
          className="sm:hidden"
          size="sm"
          opened={opened}
          onClick={toggle}
          aria-label="Burger menuyu aç"
        /> */}
        <Sidebar
          onlineUsers={onlineUsers}
          socket={socket}
          opened
          isSmScreen={isSmScreen}
        />
        {chatContainer}
      </div>
    </div>
  );
}
