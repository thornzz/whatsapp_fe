import { useDispatch } from "react-redux";
import { setActiveConversation } from "../../../features/chatSlice";
import { logout } from "../../../features/userSlice";

export default function Menu() {
  const dispatch = useDispatch();

  return (
    <>
      <div className="absolute right-1 z-50 dark:bg-dark_bg_2 dark:text-dark_text_1 shadow-md w-52">
        <ul>
          {/* <li
            className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
            onClick={() => setShowCreateGroup(true)}
          >
            <span>Yeni grup sohbeti</span>
          </li> */}

          <li className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3">
            <span>Ayarlar</span>
          </li>
          <li
            className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
            onClick={() => {
              //socket.disconnect();
              dispatch(setActiveConversation({}));
              dispatch(logout());
            }}
          >
            <span>Çıkış yap</span>
          </li>
        </ul>
      </div>
    </>
  );
}
