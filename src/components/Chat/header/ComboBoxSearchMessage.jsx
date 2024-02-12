import { useDispatch, useSelector } from "react-redux";
import { tarihFormatla } from "../../../utils/date";
import classes from "./ComboBox.module.css";
import {
  Combobox,
  Text,
  Highlight,
  Flex,
  Divider,
  useCombobox,
  ActionIcon,
  ScrollArea,
} from "@mantine/core";

import { IconSearch } from "@tabler/icons-react";
import React, { useState } from "react";
import { setFocusedMessage } from "../../../features/chatSlice";

function ComboBoxSearchMessage() {
  const dispatch = useDispatch();
  const { activeConversation, messages } = useSelector((state) => state.chat);
  const [search, setSearch] = useState("");
  const comboboxSearchMessage = useCombobox({
    scrollBehavior: "smooth",
    onDropdownClose: () => {
      comboboxSearchMessage.resetSelectedOption();
      setSearch("");
    },
    onDropdownOpen: () => {
      comboboxSearchMessage.focusSearchInput();
    },
  });
  const searchOptions = messages
    .filter((item) =>
      item.message.toLowerCase().includes(search.toLowerCase().trim())
    )
    .map((item, index) => (
      <Combobox.Option
        className={classes.option}
        value={item}
        key={item._id}
        onMouseOver={() => comboboxSearchMessage.selectOption(index)}
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
  return (
    <Combobox
      withinPortal={false}
      store={comboboxSearchMessage}
      width={350}
      height={300}
      size="md"
      position="bottom"
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
      onOptionSubmit={(val) => {
        dispatch(setFocusedMessage(val));
        comboboxSearchMessage.closeDropdown();
      }}
    >
      <Combobox.Target withAriaAttributes={false}>
        <ActionIcon
          variant="light"
          size={36}
          color="gray"
          aria-label="Search"
          onClick={() => {
            comboboxSearchMessage.toggleDropdown();
          }}
        >
          <IconSearch style={{ width: "100%", height: "100%" }} stroke={1.5} />
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
            {searchOptions.length > 0 ? (
              searchOptions
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
  );
}

export default ComboBoxSearchMessage;
