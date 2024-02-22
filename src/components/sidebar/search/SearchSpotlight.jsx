import { Center, Group, Text } from "@mantine/core";
import { Spotlight } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import {
  getUserConversations,
  setActiveConversation,
} from "../../../features/chatSlice";
import { axiosPrivate } from "../../../utils/axiosprivate";

function SearchSpotlight() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    getUsers();
  }, [user]);

  async function getUsers() {
    try {
      const { data } = await axiosPrivate.get("/user");
      setSearchResults(data);
      setQuery("");
    } catch (error) {
      console.log(error);
    }
  }
  const openConversation = async (data) => {
    const values = {
      receiver_id: data._id,
    };
    dispatch(getUserConversations(values));
    dispatch(setActiveConversation({}));
  };

  const items = searchResults
    .filter((item) => {
      const { phonenumber, name } = item;

      const toLowerTurkish = (str) => {
        let res = "";
        const len = str.length;
        for (let i = 0; i < len; i++) {
          let ch = str.charAt(i);
          if (ch === "İ") {
            res += "i";
          } else {
            res += ch.toLowerCase();
          }
        }
        return res;
      };

      const lowerCaseQuery = toLowerTurkish(query.trim());
      return (
        phonenumber.includes(lowerCaseQuery) ||
        toLowerTurkish(name).includes(lowerCaseQuery)
      );
    })
    .map((item) => (
      <Spotlight.Action key={item._id} onClick={() => openConversation(item)}>
        <Group wrap="nowrap" w="100%">
          {item.picture && (
            <Center>
              <img src={item.picture} alt={item.name} width={35} height={35} />
            </Center>
          )}

          <div style={{ flex: 1 }}>
            <Text>{item.name}</Text>

            {item.phonenumber && (
              <Text opacity={0.6} size="xs">
                {item.phonenumber}
              </Text>
            )}
          </div>
        </Group>
      </Spotlight.Action>
    ));

  return (
    <Spotlight.Root
      query={query}
      onQueryChange={setQuery}
      shortcut={["mod + K", "mod + P", "/"]}
    >
      <Spotlight.Search
        placeholder="Kişi ara..."
        leftSection={<IconSearch stroke={1.5} />}
      />
      <Spotlight.ActionsList>
        {items.length > 0 ? (
          items
        ) : (
          <Spotlight.Empty>Kişi bulunamadı...</Spotlight.Empty>
        )}
      </Spotlight.ActionsList>
    </Spotlight.Root>
  );
}

export default SearchSpotlight;
