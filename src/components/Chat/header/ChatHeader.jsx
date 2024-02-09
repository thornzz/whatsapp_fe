import moment from "moment";
import {
  ActionIcon,
  Menu,
  rem,
  Text,
  useCombobox,
  Combobox,
  Highlight,
  ScrollArea,
  Flex,
  Divider,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconDotsVertical, IconSearch, IconTrash } from "@tabler/icons-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SocketContext from "../../../context/SocketContext";
import {
  closeConversation,
  removeClosedConversation,
  setActiveConversation,
  setFocusedMessage,
} from "../../../features/chatSlice";
import {
  getConversationNamePhoneNumber,
  getConversationPicture,
} from "../../../utils/chat";
import classes from "./ChatHeader.module.css";
import { tarihFormatla } from "../../../utils/date";

function ChatHeader({ online, socket }) {
  const { activeConversation, messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const dispatch = useDispatch();
  const values = {
    convo_id: activeConversation?._id,
    token,
  };
  const [search, setSearch] = useState("");

  const combobox = useCombobox({
    scrollBehavior: "smooth",
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      setSearch("");
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const options = messages
    .filter((item) =>
      item.message.toLowerCase().includes(search.toLowerCase().trim())
    )
    .map((item, index) => (
      <Combobox.Option
        className={classes.option}
        value={item}
        key={item._id}
        onMouseOver={() => combobox.selectOption(index)}
        style={{ padding: 2 }}
      >
        <Flex justify="flex-start" align="flex-start" direction="column">
          <Text size="xs">{tarihFormatla(item.createdAt)}</Text>
          <Highlight
            highlight={search}
            size="sm"
            highlightStyles={{
              backgroundImage: "linear-gradient(45deg, #09A884,#09A884)",
              fontWeight: 700,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {item.message}
          </Highlight>
        </Flex>
        <Divider my="xs" variant="dotted" />
      </Combobox.Option>
    ));
  const deleteDialog = () =>
    modals.openConfirmModal({
      title: "Sohbet sonlandırma",
      children: (
        <Text size="sm">
          İlgili sohbeti sonlandırma işlemine devam etmek istiyor musunuz?
        </Text>
      ),
      confirmProps: { color: "red" },
      centered: true,
      labels: { confirm: "Onayla", cancel: "İptal et" },
      onCancel: () =>
        notifications.show({
          color: "red",
          position: "bottom-center",
          title: "Sohbeti sonlandırma",
          message: "Sohbeti sonlandırma işlemi iptal edildi",
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
              <Combobox
                withinPortal={false}
                store={combobox}
                width={350}
                height={300}
                size="md"
                position="bottom"
                onOptionSubmit={(val) => {
                  dispatch(setFocusedMessage(val));
                  combobox.closeDropdown();
                }}
                styles={{
                  dropdown: {
                    backgroundColor: "#202c33",
                    borderColor: "#46494d",
                    marginLeft: "-95px",
                  },
                  search: {
                    backgroundColor: "#202c33",
                    borderColor: "#46494d",
                  },
                }}
              >
                <Combobox.Target withAriaAttributes={false}>
                  <ActionIcon
                    variant="light"
                    size={36}
                    color="gray"
                    aria-label="Search"
                    onClick={() => {
                      combobox.toggleDropdown();
                    }}
                  >
                    <IconSearch
                      style={{ width: "100%", height: "100%" }}
                      stroke={1.5}
                    />
                  </ActionIcon>
                </Combobox.Target>

                <Combobox.Dropdown>
                  <Combobox.Search
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    placeholder="Mesajlarda Ara"
                  />
                  <Combobox.Options hidden={search.trim().length === 0}>
                    <ScrollArea.Autosize mah={200} type="scroll">
                      {options.length > 0 ? (
                        options
                      ) : (
                        <Combobox.Empty>Mesaj bulunamadı :/</Combobox.Empty>
                      )}
                    </ScrollArea.Autosize>
                  </Combobox.Options>
                  <Combobox.Footer>
                    <Text fz="xs" c="dimmed" hidden={search.trim().length > 0}>
                      {`+${activeConversation.name} numarası ile aranızdaki mesajları arayın`}
                    </Text>
                  </Combobox.Footer>
                </Combobox.Dropdown>
              </Combobox>
            </li>

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
                    Sohbeti sonlandır
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
