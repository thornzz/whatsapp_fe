import moment from "moment";
import TraingleIcon from "../../../svg/triangle";
import { MdDone, MdOutlineDoneAll } from "react-icons/md";
export default function Message({ message, me }) {
  return (
    <div
      className={`w-full flex mt-2 space-x-3 max-w-xs ${
        me ? "ml-auto justify-end " : ""
      }`}
    >
      {/*Message Container*/}
      <div className="relative">
        {/* sender user message */}
        {!me && message.conversation.isGroup && (
          <div className="absolute top-0.5 left-[-37px]">
            <img
              src={message.sender.picture}
              alt=""
              className="w-8 h-8 rounded-full"
            />
          </div>
        )}
        <div
          className={`relative h-full dark:text-dark_text_1 p-2 rounded-lg
        ${me ? "bg-green_3" : "dark:bg-dark_bg_2"}
        `}
        >
          {/*Message*/}
          <p className="float-left h-full text-sm pb-4 pr-8">
            {message.message}
          </p>
          {/*Message Date*/}
          <span className="absolute right-6 bottom-0.5 text-xs text-dark_text_5 leading-none">
            {moment(message.createdAt).format("DD.MM.YYYY HH:mm")}
            {me ? (
              <span className="absolute left-8 bottom-0 text-xs text-dark_text_5 leading-none">
                {message.status === "delivered" ? (
                  <MdOutlineDoneAll />
                ) : message.status === "sent" ? (
                  <MdDone />
                ) : message.status === "read" ? (
                  <MdOutlineDoneAll className="text-sky-500" />
                ) : null}
              </span>
            ) : null}
          </span>

          {/*Traingle*/}
          {!me ? (
            <span>
              <TraingleIcon className="dark:fill-dark_bg_2 rotate-[60deg] absolute top-[-5px] -left-1.5" />
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
