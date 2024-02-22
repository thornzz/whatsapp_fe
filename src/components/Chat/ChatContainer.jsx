import { LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getClosedConversationMessages,
  getConversationMessages,
  setActiveConversation,
} from "../../features/chatSlice";

import { ChatActions } from "./actions";
import ChatHeader from "./header/ChatHeader";
import ChatMessages from "./messages/ChatMessages";
import FileDropzone from "./messages/files/FileDropzone";
import FilesPreview from "./preview/files/FilesPreview";

export default function ChatContainer({ onlineUsers }) {
  const dispatch = useDispatch();
  const { activeConversation, files, status } = useSelector(
    (state) => state.chat
  );
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [visible, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (["loading", "failed"].includes(status)) {
      open();
    } else if (status === "succeeded") {
      close();
    }
  }, [status, open, close]);

  useEffect(() => {
    if (activeConversation?._id) {
      const values = {
        token,
        convo_id: activeConversation?._id,
        convo_name: activeConversation?.name,
      };
      const action = activeConversation.closed
        ? getClosedConversationMessages
        : getConversationMessages;
      dispatch(action(values));
    }
  }, [activeConversation, dispatch, token]);

  const handleEscapePress = useCallback(
    (e) => {
      if (e.code === "Escape") {
        dispatch(setActiveConversation({}));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscapePress);
    return () => {
      document.removeEventListener("keydown", handleEscapePress);
    };
  }, [handleEscapePress]);

  const isFilesPreviewVisible = files.length > 0;

  return (
    <>
      {!activeConversation.closed && <FileDropzone />}
      <div className="relative w-full h-full border-l dark:border-l-dark_border_2 select-none overflow-hidden">
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 3 }}
          loaderProps={{ color: "#075E54", type: "bars" }}
        />
        <div>
          <ChatHeader onlineUsers={onlineUsers} />
          {isFilesPreviewVisible ? (
            <FilesPreview />
          ) : (
            <>
              <ChatMessages />
              <ChatActions />
            </>
          )}
        </div>
      </div>
    </>
  );
}
