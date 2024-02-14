import { ActionIcon, Avatar, Combobox, Group, Indicator, ScrollArea, Text, useCombobox } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconTransfer } from "@tabler/icons-react";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getConversations, setActiveConversation } from "../../../features/chatSlice";
import classes from "./ComboBox.module.css";

function ComboBoxTransferConversation({ onlineUsers, socket }) {
  const CONVERSATION_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/conversation`;
  const dispatch = useDispatch();
  const { activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [searchAgent, setSearchAgent] = useState("");
  const [transferredUser, setTransferredUser] = useState({});

  const comboboxTransferConvo = useCombobox({
    scrollBehavior: "smooth",
    onDropdownClose: () => {
      comboboxTransferConvo.resetSelectedOption();
      setSearchAgent("");
    },

    onDropdownOpen: () => {
      comboboxTransferConvo.focusSearchInput();
    },
  });
  const agentOptions = onlineUsers
    .filter(
      (item) =>
        item.user.name
          .toLowerCase()
          .includes(searchAgent.toLowerCase().trim()) &&
        item.user._id !== user._id
    )
    .map((item, index) => (
      <Combobox.Option
        className={classes.option}
        value={item}
        key={item.user._id}
        onMouseOver={() => comboboxTransferConvo.selectOption(index)}
        style={{ padding: 2 }}
      >
        <Group>
          <Indicator
            inline
            processing
            color="green"
            size={10}
            offset={5}
            position="bottom-end"
            withBorder
          >
            <Avatar src={item.user.picture}></Avatar>
          </Indicator>
          <Text>{item.user.name}</Text>
        </Group>
      </Combobox.Option>
    ));

  const transferDialog = (user) =>
    modals.openConfirmModal({
      trapFocus: false,
      title: "Sohbet transferi",

      children: (
        <Text size="sm">
          İlgili sohbetin transfer işlemine devam etmek istiyor musunuz?
        </Text>
      ),
      confirmProps: { color: "#00A884" },
      centered: true,
      labels: { confirm: "Onayla", cancel: "İptal et" },
      onCancel: () =>
        notifications.show({
          color: "gray",
          position: "bottom-center",
          title: `Sohbet transfer işlemi`,
          message: "İşlem iptal edildi.",
          styles: {
            body: { backgroundColor: "#202C33" },
            root: { backgroundColor: "#202C33" },
          },
        }),
      onConfirm: () => transferConversationHandler(user),
    });

  const transferConversationHandler = async (transferredUser) => {
    try {
      axios
        .post(
          `${CONVERSATION_ENDPOINT}/transfer`,
          {
            convo_id: activeConversation._id,
            oldUserId: user._id,
            newUserId: transferredUser.user._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          notifications.show({
            color: "#00A884",
            position: "bottom-center",
            title: `Sohbet transfer işlemi`,
            message: "Başarıyla tamamlandı.",
            styles: {
              body: { backgroundColor: "#202C33" },
              root: { backgroundColor: "#202C33" },
            },
          });
          socket.emit("message_transferred", {
            transferrer: { ...user, socketId: socket.id },
            transferredUser,
          });
          dispatch(getConversations(user.token));
          dispatch(setActiveConversation({}));
        })
        .catch((err) => {
          notifications.show({
            color: "red",
            position: "bottom-center",
            title: `Sohbet transfer işlemi`,
            message: "Bir hata oluştu.",
            styles: {
              body: { backgroundColor: "#202C33" },
              root: { backgroundColor: "#202C33" },
            },
          });
        });
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <Combobox
      withinPortal={false}
      store={comboboxTransferConvo}
      width={350}
      height={300}
      size="md"
      position="bottom"
      onOptionSubmit={(val) => {
        comboboxTransferConvo.closeDropdown();
        transferDialog(val);
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
          aria-label="Search Active Agents"
          onClick={() => {
            comboboxTransferConvo.toggleDropdown();
          }}
        >
          <IconTransfer
            style={{ width: "100%", height: "100%" }}
            stroke={1.5}
          />
        </ActionIcon>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={searchAgent}
          onChange={(event) => setSearchAgent(event.currentTarget.value)}
          placeholder="Aktif Temsilcilerde Arayın"
        />
        <Combobox.Options hidden={searchAgent.trim().length === 0}>
          <ScrollArea.Autosize mah={200} type="scroll">
            {agentOptions.length > 0 ? (
              agentOptions
            ) : (
              <Combobox.Empty>Temsilci bulunamadı :/</Combobox.Empty>
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
        <Combobox.Footer>
          <Text fz="xs" c="dimmed" hidden={searchAgent.trim().length > 0}>
            {`Sohbetin transfer edileceği temsilciyi seçin`}
          </Text>
        </Combobox.Footer>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default ComboBoxTransferConversation;
