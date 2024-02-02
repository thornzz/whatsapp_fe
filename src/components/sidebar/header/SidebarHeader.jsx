import { useDispatch, useSelector } from "react-redux";
import { ChatIcon, CommunityIcon, DotsIcon, StoryIcon } from "../../../svg";
import {MdHistory, MdOutlineDoneAll} from "react-icons/md";
import { useState } from "react";
import Menu from "./Menu";
import { CreateGroup } from "./createGroup";
import {
  getClosedConversations,
  getConversations,
  setActiveConversation,
} from "../../../features/chatSlice";

export default function SidebarHeader() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const handleOpenConversations = async () => {
    if (user?.token) {
      dispatch(getConversations(user.token));
      dispatch(setActiveConversation({}));
    }
  };

  const handleClosedConversations = async () => {
    if (user?.token) {
      const values = { token: user.token, closed: true };
      dispatch(getClosedConversations(values));
      dispatch(setActiveConversation({}));
    }
  };

  return (
    <>
      {/*Sidebar header*/}
      <div className="h-[50px] dark:bg-dark_bg_2 flex items-center p16">
        {/* container */}
        <div className="w-full flex items-center justify-between">
          {/*user image*/}
          <button className="btn">
            <img
              src={user.picture}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          </button>
          {/*user icons*/}
          <ul className="flex items-center gap-x-2 5">
            <li onClick={handleOpenConversations}>
              <button className="btn">
                <ChatIcon className="dark:fill-dark_svg_1" />
              </button>
            </li>
            <li onClick={handleClosedConversations}>
              <button className="btn">
                <MdHistory className="dark:fill-dark_svg_1 h-6 w-6"/>
              </button>
            </li>
            <li
              className="relative"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <button className={`btn ${showMenu ? "bg-dark_hover_1" : ""}`}>
                <DotsIcon className="dark:fill-dark_svg_1" />
              </button>
              {showMenu ? (
                <Menu setShowCreateGroup={setShowCreateGroup} />
              ) : null}
            </li>
          </ul>
        </div>
      </div>
      {/*Create Group*/}
      {showCreateGroup && (
        <CreateGroup setShowCreateGroup={setShowCreateGroup} />
      )}
    </>
  );
}
