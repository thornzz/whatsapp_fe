import { Menu, rem, ActionIcon, Avatar } from "@mantine/core";
import { IconLogout, IconUsers, IconSettings } from "@tabler/icons-react";
import { MdHistory } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  getClosedConversations,
  getConversations,
  setActiveConversation,
} from "../../../features/chatSlice";
import { logout } from "../../../features/userSlice";
import { ChatIcon, DotsIcon } from "../../../svg";
import OnlineUsers from "./OnlineUsers";
// import { CreateGroup } from "../header/createGroup/index.js";

export default function SidebarHeader({ onlineUsers, socket }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
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
        <div className="w-full flex items-center justify-start gap-3">
          {/*user image*/}
          <Avatar src={user.picture} alt={user.name} />
          {/*online users*/}
          <ActionIcon
            variant="subtle"
            size={30}
            color="gray"
            aria-label="Online Users"
            onClick={() => setShowOnlineUsers(true)}
          >
            <IconUsers
              size={24}
              color="#AEBAC1"
              style={{ width: "100%", height: "100%" }}
              stroke={2}
            />
          </ActionIcon>
          <div />
          <div className="w-full flex items-center justify-end">
            {/*user icons*/}
            <ul className="flex items-center gap-x-2 5">
              <li onClick={handleOpenConversations}>
                <button className="btn">
                  <ChatIcon className="dark:fill-dark_svg_1" />
                </button>
              </li>
              <li onClick={handleClosedConversations}>
                <button className="btn">
                  <MdHistory className="dark:fill-dark_svg_1 h-6 w-6" />
                </button>
              </li>
              <li>
                <Menu
                  position="left-start"
                  offset={0}
                  shadow="md"
                  width={200}
                  styles={{
                    dropdown: {
                      backgroundColor: "#202c33",
                      borderColor: "#46494d",
                    },
                    itemLabel: {
                      color: "#e9edef",
                    },
                  }}
                >
                  <Menu.Target>
                    <button className="btn">
                      <DotsIcon className="dark:fill-dark_svg_1" />
                    </button>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item
                      disabled
                      leftSection={
                        <IconSettings
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      }
                    >
                      Ayarlar
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => {
                        //socket.disconnect();
                        dispatch(setActiveConversation({}));
                        dispatch(logout());
                        socket.disconnect();
                      }}
                      leftSection={
                        <IconLogout
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      }
                    >
                      Oturumu sonlandır
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {showOnlineUsers && (
        <OnlineUsers
          setShowOnlineUsers={setShowOnlineUsers}
          onlineUsers={onlineUsers}
        />
      )}
    </>
  );
}
