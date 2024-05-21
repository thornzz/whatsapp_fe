import { Button, Flex, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconInfoSquareFilled } from "@tabler/icons-react";
import React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getConversations,
  updateMessagesAndConversations,
  updateStatues,
} from "../features/chatSlice.js";
import { logout } from "../features/userSlice.js";

export const useSocket = (socket, user) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const dispatch = useDispatch();

  const handleUnload = () => {
    socket.disconnect();
    console.log("Socket bağlantısı kesildi");
  };

  useEffect(() => {
    socket.on("receive message", (message, userId) => {
      dispatch(updateMessagesAndConversations(message));
    });
    socket.on("get-online-users", (users) => {
      setOnlineUsers(users);
    });
    socket.on("update statues", (message) => {
      dispatch(updateStatues(message));
    });

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

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      // Event listenelar kaldırılıyor
      socket.off("receive message");
      socket.off("update statues");
      socket.off("existing_user");
      socket.off("disconnect");
      socket.off("incoming-waba-status");
      socket.off("incoming-waba-message");
      socket.off("get-online-users");

      window.removeEventListener("beforeunload", handleUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return [onlineUsers];
};
