import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileMessage from "./files/FileMessage";
import Message from "./Message";

export default function ChatMessages() {
  const { messages, activeConversation, focusedMessage } = useSelector(
    (state) => state.chat
  );
  const { user } = useSelector((state) => state.user);
  const endRef = useRef();
  const messageRefs = useRef({});

  useEffect(() => {
    // Mesajlar güncellendiğinde scroll işlemini tetikle
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Mesajlar güncellendiğinde useEffect hook'unu tetikle

  useEffect(() => {
    scrollMessageIntoView(focusedMessage?._id);
  }, [focusedMessage]);

  const scrollMessageIntoView = (messageId) => {
    const focusedMessage = messageRefs.current[messageId];

    if (focusedMessage) {
      focusedMessage.ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  };

  const handleMessageRef = (ref, index, messageId) => {
    if (ref) {
      messageRefs.current[messageId] = {
        ref,
        index,
      };
    }
  };

  return (
    <div
      className="mb-[60px] bg-[url('https://res.cloudinary.com/dmhcnhtng/image/upload/v1677358270/Untitled-1_copy_rpx8yb.jpg')]
      bg-cover bg-no-repeat "
    >
      {/*Container*/}
      <div className="scrollbar overflow_scrollbar overflow-y-auto py-2 px-[5%]">
        {/*Messages*/}

        {messages &&
          messages.map((message, index) => (
            <React.Fragment key={message._id}>
              {/* Message files */}
              {message.files.length > 0 && message.type === "cloudinary"
                ? message.files.map((file, index) => (
                    <FileMessage
                      FileMessage={file}
                      message={message}
                      key={`${message._id}_file_${index}`}
                      me={user._id === message.sender._id}
                    />
                  ))
                : message.files.length > 0 && message.type === "waba"
                ? message.files.map((file, index) => (
                    <FileMessage
                      WabaMessage={file}
                      message={message}
                      key={`${message._id}_file_${index}`}
                      me={user._id === message.sender._id}
                    />
                  ))
                : null}
              {/* Message text */}
              {message.message.length > 0 && !message.files.length > 0 ? (
                <Message
                  message={message}
                  index={index}
                  me={user._id === message.sender._id}
                  onRefUpdate={handleMessageRef}
                  focusedMessage={focusedMessage}
                  user={user}
                />
              ) : null}
            </React.Fragment>
          ))}

        <div className="mt-2" ref={endRef}></div>
      </div>
    </div>
  );
}
