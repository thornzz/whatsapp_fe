import { Flex, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import Conversation from "./Conversation";

export default function Conversations({ onlineUsers, typing, isSmScreen }) {
  const { conversations, activeConversation } = useSelector(
    (state) => state.chat
  );

  const isConversationsEmpty = conversations.length === 0;

  const renderConversationList = () =>
    conversations
      .filter(
        (convo) =>
          convo.latestMessage ||
          convo._id === activeConversation._id ||
          convo.isGroup
      )
      .map((convo) => <Conversation key={convo._id} convo={convo} />);

  return (
    <>
      {(isSmScreen && Object.keys(activeConversation).length === 0) ||
      !isSmScreen ? (
        <div className="convos scrollbar">
          <ul>
            {!isConversationsEmpty ? (
              renderConversationList()
            ) : (
              <Flex justify="center" mt={5}>
                <Text
                  tt="uppercase"
                  style={{ fontStyle: "italic" }}
                  size="xs"
                  className="sm:text-xs md:text-2xl lg:text-3xl"
                >
                  Dahil olduğunuz bir sohbet bulunmuyor.
                </Text>
              </Flex>
            )}
          </ul>
        </div>
      ) : null}
    </>
  );
}
