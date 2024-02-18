import { LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { spotlight } from "@mantine/spotlight";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getClosedConversationMessages, getConversationMessages, setActiveConversation } from "../../features/chatSlice";
import { checkOnlineStatus } from "../../utils/chat";
import { ChatActions } from "./actions";
import ChatHeader from "./header/ChatHeader";
import ChatMessages from "./messages/ChatMessages";
import FileDropzone from "./messages/files/FileDropzone";
import FilesPreview from "./preview/files/FilesPreview";

export default function ChatContainer({ onlineUsers, typing, callUser }) {
  const dispatch = useDispatch();
  const { activeConversation, files, status } = useSelector(
    (state) => state.chat
  );
  const [visible, { open, close }] = useDisclosure(false);

  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const values = {
    token,
    convo_id: activeConversation?._id,
    convo_name: activeConversation?.name,
  };

  useEffect(() => {
    if (status === "loading" || status === "failed") {
      open();
    } else if (status === "succeeded") {
      close();
    }
  }, [status]);

  useEffect(() => {
    if (activeConversation?._id && !activeConversation?.closed) {
      dispatch(getConversationMessages(values));
    } else if (activeConversation?._id && activeConversation?.closed) {
      dispatch(getClosedConversationMessages(values));
    }
  }, [activeConversation]);

  //Escape tuşuna basıldığında activeConvoyu temizle
  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          dispatch(setActiveConversation({}));
        }
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [activeConversation]
  );

  return (
    <>
      {!activeConversation.closed &&<FileDropzone />}
      <div className="relative w-full h-full border-l dark:border-l-dark_border_2 select-none overflow-hidden ">
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 3 }}
          loaderProps={{ color: "#075E54", type: "bars" }}
        />

        {/*Container*/}
        <div>
          {/*Chat header*/}
          <ChatHeader
            // online={
            //   activeConversation.isGroup
            //     ? false
            //     : checkOnlineStatus(onlineUsers, user, activeConversation.users)
            // }

            //callUser={callUser}
            onlineUsers={onlineUsers}
          />
          {files.length > 0 ? (
            <FilesPreview />
          ) : (
            <>
              {/*Chat messages*/}
              <ChatMessages typing={typing} />
              {/* Chat Actions */}
              <ChatActions />
            </>
          )}
        </div>
      </div>
    </>
  );
}
