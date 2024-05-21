import { Divider, Mark } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdDone, MdOutlineDoneAll, MdSmsFailed } from "react-icons/md";
import { useDispatch } from "react-redux";

import { setFocusedMessage } from "../../../features/chatSlice";
import TraingleIcon from "../../../svg/triangle";

const DATE_FORMAT_CLOSED = "DD.MM.YYYY HH:mm";
const DATE_FORMAT_OPEN = "HH:mm";
const MESSAGE_STATUS = {
  DELIVERED: "delivered",
  SENT: "sent",
  READ: "read",
  FAILED: "failed",
};

const Message = ({ message, me, index, user, onRefUpdate, focusedMessage }) => {
  const messageRef = useRef();
  const dispatch = useDispatch();
  const isFocusedMessage = message?._id === focusedMessage?._id;
  const [isHighlighted, setHighlighted] = useState(false);
  const clickOutSideRef = useClickOutside(() => {
    setHighlighted(false);
    dispatch(setFocusedMessage({}));
  });

  useEffect(() => {
    onRefUpdate(messageRef, index, message._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageRef]);

  useEffect(() => {
    setHighlighted(true);
  }, [focusedMessage]);

  function getMessageStatusIcon() {
    switch (message.status) {
      case MESSAGE_STATUS.DELIVERED:
        return <MdOutlineDoneAll />;
      case MESSAGE_STATUS.SENT:
        return <MdDone />;
      case MESSAGE_STATUS.READ:
        return <MdOutlineDoneAll className="text-sky-500" />;
      case MESSAGE_STATUS.FAILED:
        return <MdSmsFailed className="text-red-500" />;
      default:
        return null;
    }
  }

  function getDivClasses() {
    if (
      me ||
      (message.conversation.transferred && message.sender.type !== "waba")
    ) {
      return "ml-auto justify-end ";
    } else if (
      !me &&
      message.conversation.transferred &&
      message.sender.type !== "waba"
    ) {
      return "justify-start ";
    } else {
      return "";
    }
  }

  function addTransferMessageDivider(message, isFirst) {
    const transfers = message.conversation.transfers;
    const isTransferMessage = transfers?.find((transfer) =>
      isFirst
        ? transfer.firstMessageBeforeTransfer === message._id
        : transfer.latestMessageBeforeTransfer === message._id
    );

    if (isTransferMessage?.from._id === user._id) return null;

    return (
      isTransferMessage && (
        <Divider
          my="xs"
          variant="dashed"
          label={`${
            isTransferMessage.from.name
          } tarafından transfer edilen mesaj ${
            isFirst ? "başlangıcı" : "sonu"
          }`}
          labelPosition="center"
          color="#7c7c7c"
          style={{ fontStyle: "italic" }}
        />
      )
    );
  }

  return (
    <>
      {addTransferMessageDivider(message, true)}
      <div
        className={`w-full flex mt-2 space-x-3 max-w-xs ${getDivClasses(
          me,
          message
        )}`}
      >
        {/*Message Container*/}
        <div className="relative">
          <div
            className={`relative h-full dark:text-dark_text_1 p-2 rounded-lg ${
              me ? "bg-green_3" : "dark:bg-dark_bg_2"
            }`}
          >
            {/*Message*/}
            <p
              ref={messageRef}
              className={`float-left h-full text-sm pb-4 pr-8 text-dark_text_1`}
              style={{
                WebkitUserSelect: "text",
                MozUserSelect: "text",
                msUserSelect: "text",
                userSelect: "text",
              }}
            >
              {isFocusedMessage && isHighlighted ? (
                <Mark ref={clickOutSideRef}>{message.message}</Mark>
              ) : (
                message.message
              )}
              {/*Message Status*/}
              {me && (
                <span className="absolute bottom-0 right-1 text-xs text-dark_text_5 leading-none">
                  {getMessageStatusIcon(message.status)}
                </span>
              )}
            </p>

            {/*Triangle*/}
            {!me && (
              <span>
                <TraingleIcon className="dark:fill-dark_bg_2 rotate-[60deg] absolute top-[-5px] -left-1.5" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/*Message Date*/}
      <div
        className={`text-xs mt-2 text-dark_text_5 leading-none ${
          me ||
          (message.conversation.transferred && message.sender.type !== "waba")
            ? "text-right"
            : ""
        }`}
      >
        {message.conversation.closed
          ? moment(message.createdAt).format(DATE_FORMAT_CLOSED)
          : moment(message.createdAt).format(DATE_FORMAT_OPEN)}
      </div>
      {addTransferMessageDivider(message, false)}
    </>
  );
};

export default Message;
