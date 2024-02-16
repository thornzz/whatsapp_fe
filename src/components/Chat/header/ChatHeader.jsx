import { ActionIcon, Menu, rem, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SocketContext from "../../../context/SocketContext";
import {
  closeConversation,
  removeClosedConversation,
  setActiveConversation,
} from "../../../features/chatSlice";
import {
  getConversationNamePhoneNumber,
  getConversationPicture,
} from "../../../utils/chat";
import ComboBoxSearchMessage from "./ComboBoxSearchMessage";
import ComboBoxTransferConversation from "./ComboBoxTransferConversation";

function ChatHeader({ socket, onlineUsers }) {
  const { activeConversation, messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const dispatch = useDispatch();
  const values = {
    convo_id: activeConversation?._id,
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
                {/* {online ? "Çevrimiçi" : ""} */}
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
                    size={36}
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

                  <Menu.Divider />
                </Menu.Dropdown>
              </Menu>
            </li>

            {/* <li>
              <button className="btn">
                <DotsIcon className="dark:fill-dark_svg_1" />
              </button>
            </li> */}
          </ul>
        </div>
      </div>
    </>
  );
}

const ChatHeaderWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatHeader {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default ChatHeaderWithSocket;
