import { Flex, Text } from "@mantine/core";
import { useSelector } from "react-redux";

//import { checkOnlineStatus, getConversationId } from "../../../utils/chat";
import Conversation from "./Conversation";

export default function Conversations({ onlineUsers, typing }) {
  const { conversations, activeConversation } = useSelector(
    (state) => state.chat
  );
  // const { user } = useSelector((state) => state.user);
  return (
    <div className="convos scrollbar">
      <ul>
        {conversations &&
          conversations
            .filter(
              (c) =>
                c.latestMessage ||
                c._id === activeConversation._id ||
                c.isGroup === true
            )
            .map((convo) => {
              // let check = checkOnlineStatus(onlineUsers, user, convo.users);
              return (
                <Conversation
                  convo={convo}
                  key={convo._id}
                  // online={!convo.isGroup && check ? true : false}
                  //  typing={typing}
                />
              );
            })}
        {conversations.length === 0 && (
          <>
            <Flex justify="center" mt={5}>
              <Text tt="uppercase" style={{ fontStyle: "italic" }} size="xs">
                Dahil olduğunuz aktif bir sohbet bulunmuyor.
              </Text>
            </Flex>
          </>
        )}
      </ul>
    </div>
  );
}
