import { AttachmentIcon } from "../../../../svg";
//import Menu from "./menu/Menu";
import { useRef } from "react";
import { addFiles } from "../../../../features/chatSlice";
import { useDispatch } from "react-redux";
import { getFileType } from "../../../../utils/file";

export default function Attachments({
  showAttachments,
  setShowAttachments,
  setShowPicker,
}) {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const documentHandler = (e) => {
    let files = Array.from(e.target.files);
    files.forEach((file) => {
      if (
        file.type !== "application/pdf" &&
        file.type !== "text/plain" &&
        file.type !== "application/msword" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
        file.type !== "application/vnd.ms-powerpoint" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" &&
        file.type !== "application/vnd.ms-excel" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        files = files.filter((item) => item.name !== file.name);
        console.log(file.type);
        return;
      } else if (file.size > 1024 * 1024 * 10) {
        files = files.filter((item) => item.name !== file.name);
        return;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          dispatch(
            addFiles({
              file: file,
              type: getFileType(file.type),
            })
          );
        };
      }
    });
  };

  return (
    <li className="relative">
      <button
        // onClick={() => {
        //   setShowPicker(false);
        //   setShowAttachments((prev) => !prev);
        // }}
        onClick={() => inputRef.current.click()}
        type="button"
        className="btn"
      >
        <AttachmentIcon className="dark:fill-dark_svg_1" />
      </button>
      {/* Menu
      {showAttachments ? <Menu /> : null} */}
      <input
        type="file"
        hidden
        multiple
        ref={inputRef}
        accept=".xls, .xlsx, .ppt, .pptx, .doc, .docx, .txt, .pdf"
        onChange={documentHandler}
      />
    </li>
  );
}
