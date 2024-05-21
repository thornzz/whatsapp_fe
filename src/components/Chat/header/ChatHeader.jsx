import { ActionIcon, Avatar, Menu, rem, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconBrandTwitch,
  IconDotsVertical,
  IconLogout,
  IconTrash,
} from "@tabler/icons-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { useSocketContext } from "../../../context/SocketProvider";
import {
  closeConversation,
  removeClosedConversation,
  setActiveConversation,
} from "../../../features/chatSlice";
import { logout } from "../../../features/userSlice";
import {
  getConversationNamePhoneNumber,
  getConversationPicture,
} from "../../../utils/chat";
import ComboBoxSearchMessage from "./ComboBoxSearchMessage";
import ComboBoxTransferConversation from "./ComboBoxTransferConversation";

export default function ChatHeader({ onlineUsers }) {
  const { activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const dispatch = useDispatch();
  const socket = useSocketContext();
  const values = {
    convo_id: activeConversation?._id,
    to: activeConversation?.users[0]?.phonenumber,
    token,
  };

  const deleteDialog = () =>
    modals.openConfirmModal({
      title: "Sohbet sonlandırma",

      children: (
        <Text size="sm">
          İlgili sohbeti sonlandırma işlemine devam etmek istiyor musunuz?
        </Text>
      ),
      confirmProps: { color: "#00A884" },
      centered: true,
      labels: { confirm: "Onayla", cancel: "İptal et" },
      onCancel: () =>
        notifications.show({
          color: "#00A884",
          position: "bottom-center",
          title: "Sohbeti sonlandırma",
          message: "Sohbeti sonlandırma işlemi iptal edildi",
          styles: {
            body: { backgroundColor: "#202C33" },
            root: { backgroundColor: "#202C33" },
          },
        }),
      onConfirm: closeConversationHandler,
    });
  const closeConversationHandler = async () => {
    dispatch(closeConversation(values));
    dispatch(removeClosedConversation(activeConversation));
    dispatch(setActiveConversation({}));
    notifications.show({
      color: "red",
      position: "bottom-center",
      title: "Sohbeti sonlandırma",
      message: "Sohbet arşive taşındı",
    });
    //socket.emit("join conversation", newConvo.payload._id);
  };

  return (
    <>
      <div className="h-[59px] dark:bg-dark_bg_2 flex items-center p16 select-none z-99">
        {/*Container*/}
        <div className="w-full flex items-center justify-between">
          {/*left*/}
          <div className="flex items-center gap-x-4">
            {/*Conversation image*/}
            <span className="hidOnSM">
              <Avatar
                size={40}
                radius="xl"
                src={getConversationPicture(user, activeConversation.users)}
              />
            </span>

            {/*Conversation name*/}
            <div className="flex flex-col">
              <h1 className="dark:text-white text-md font-bold">
                {getConversationNamePhoneNumber(user, activeConversation.users)}
              </h1>
            </div>
          </div>
          {/*Right*/}
          <ul className="flex items-center gap-x-2.5">
            <li>
              <ComboBoxSearchMessage />
            </li>
            {/* Hide if an closed conversation*/}
            {!activeConversation.closed && (
              <li>
                <ComboBoxTransferConversation
                  onlineUsers={onlineUsers}
                  socket={socket}
                />
              </li>
            )}

            <li>
              <Menu
                position="left-start"
                offset={0}
                shadow="md"
                width={200}
                styles={{
                  dropdown: {
                    backgroundColor: "#202c33",
                    borderColor: "#46494d",
                  },
                  itemLabel: {
                    color: "#e9edef",
                  },
                }}
              >
                <Menu.Target>
                  <ActionIcon
                    variant="light"
                    color="gray"
                    aria-label="Menu"
                    size={28}
                  >
                    <IconDotsVertical
                      style={{ width: "100%", height: "100%" }}
                      stroke={1.5}
                    />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Sohbet</Menu.Label>

                  <Menu.Item
                    disabled={activeConversation.closed ? true : false}
                    onClick={deleteDialog}
                    color="red"
                    leftSection={
                      <IconTrash style={{ width: rem(14), height: rem(14) }} />
                    }
                  >
                    Sonlandır
                  </Menu.Item>
                  <span className="hidOnMD">
                    <Menu.Item
                      onClick={() => {
                        dispatch(setActiveConversation({}));
                      }}
                      leftSection={
                        <IconBrandTwitch
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      }
                    >
                      Sohbeti Kapat
                    </Menu.Item>

                    <Menu.Label>Diğer</Menu.Label>
                    <Menu.Item
                      onClick={() => {
                        dispatch(setActiveConversation({}));
                        dispatch(logout());

                        socket.emit("logout", { ...user, socketId: socket.id });
                        socket.disconnect();
                      }}
                      leftSection={
                        <IconLogout
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      }
                    >
                      Oturumu sonlandır
                    </Menu.Item>
                  </span>
                  <Menu.Divider />
                </Menu.Dropdown>
              </Menu>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
