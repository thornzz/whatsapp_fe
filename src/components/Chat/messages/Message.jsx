import { Divider, Mark } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import moment from "moment";
import { forwardRef, useEffect, useRef, useState } from "react";
import { MdDone, MdOutlineDoneAll, MdSmsFailed } from "react-icons/md";
import { useDispatch } from "react-redux";

import { setFocusedMessage } from "../../../features/chatSlice";
import TraingleIcon from "../../../svg/triangle";

const Message = forwardRef(
  ({ message, me, index, user, onRefUpdate, focusedMessage }, ref) => {
    const messageRef = useRef();
    const dispatch = useDispatch();
    const isFocusedMessage = message?._id === focusedMessage?._id;
    const [isHighlighted, setHighlighted] = useState(false);
    console.log(message);
    const clickOutSideRef = useClickOutside(() => {
      setHighlighted(false);
      dispatch(setFocusedMessage({}));
    });
    // ref to the parent component during rendering
    useEffect(() => {
      onRefUpdate(messageRef, index, message._id);
    }, [messageRef]);

    useEffect(() => {
      setHighlighted(true);
    }, [focusedMessage]);

    function shouldShowAvatar(message, user) {
      if (!message.conversation.transferred) return false;
      const transferIndex = message.conversation.transfers.findIndex(
        (transfer) =>
          transfer.to === user._id &&
          new Date(message.createdAt) > new Date(transfer.at)
      );
      if (transferIndex > -1) {
        return false;
      }
      return true;
    }

    function addTransferMessageDivider(message, isFirst) {
      const transfers = message.conversation.transfers;
      const isTransferMessage = transfers?.some((transfer) =>
        isFirst
          ? transfer.firstMessageBeforeTransfer === message._id
          : transfer.latestMessageBeforeTransfer === message._id
      );
      if (isTransferMessage) {
        return (
          <Divider
            my="xs"
            variant="dashed"
            label={`${message.sender.name} tarafından transfer edilen mesaj ${
              isFirst ? "başlangıcı" : "sonu"
            }`}
            labelPosition="center"
            color="#7c7c7c"
            style={{ fontStyle: "italic" }}
          />
        );
      }
      return null;
    }

    return (
      <>
        {addTransferMessageDivider(message, true)}
        <div
          className={`w-full flex mt-2 space-x-3 max-w-xs ${
            me ||
            (message.conversation.transferred && message.sender.type !== "waba")
              ? "ml-auto justify-end "
              : !me &&
                message.conversation.transferred &&
                !message.sender.type !== "waba"
              ? "justify-start "
              : ""
          }`}
        >
          {/*Message Container*/}
          <div className="relative">
            {/* sender user pic if its a transferred msg */}
            {/* new Date(message.createdAt) <= new Date(lastTransfer.at) */}
            {!me &&
              message.conversation.transferred &&
              shouldShowAvatar(message, user) && (
                <div className="absolute top-0.5 left-[-37px]">
                  <img
                    src={message.sender.picture}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                </div>
              )}

            <div
              className={`relative h-full dark:text-dark_text_1 p-2 rounded-lg ${
                me ? "bg-green_3" : "dark:bg-dark_bg_2"
              }`}
            >
              {/*Message*/}
              <p
                ref={messageRef}
                className={`float-left h-full text-sm pb-4 pr-8 text-dark_text_1
                }`}
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
                    {message.status === "delivered" ? (
                      <MdOutlineDoneAll />
                    ) : message.status === "sent" ? (
                      <MdDone />
                    ) : message.status === "read" ? (
                      <MdOutlineDoneAll className="text-sky-500" />
                    ) : message.status === "failed" ? (
                      <MdSmsFailed className="text-red-500" />
                    ) : null}
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
            ? moment(message.createdAt).format("DD.MM.YYYY HH:mm")
            : moment(message.createdAt).format("HH:mm")}
        </div>
        {addTransferMessageDivider(message, false)}
      </>
    );
  }
);

export default Message;
