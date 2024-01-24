import React, { useState } from "react";
import DownloadIcon from "../../../../svg/Download";
import { DownloadFile } from "../../../../utils/waba-download";

export default function FileOthers({ file, type, me }) {
  const handleDownload = async () => {
    if (file.secure_url) {
      // Eğer secure_url varsa, doğrudan bu URL üzerinden indirme işlemi yap
      window.open(file.secure_url, "_blank");
    } else if (file.id) {
      // Eğer secure_url yoksa ve file.id varsa, DownloadFile fonksiyonunu kullanarak indirme işlemi yap
      await DownloadFile(file.id, file.filename, file.mime_type);
    }
  };

  return (
    <React.Fragment>
      <div className="bg-green_4 p-2 rounded-lg">
        {/*Container*/}
        <div className="flex justify-between gap-x-8">
          {/*File infos*/}
          <div className="flex items-center gap-2">
            <img
              src={
                type
                  ? require(`../../../../images/file/${type}.png`)
                  : require("../../../../images/file/DEFAULT.png")
              }
              alt=""
              className="w-8 object-contain"
            />

            <div className="flex flex-col gap-2">
              <h1>
                {file.secure_url
                  ? `${file.original_filename}.${file.public_id.split(".")[1]}`
                  : file.id && file.filename
                  ? `${file.filename}`
                  : "[Resim Dosyası]"}
              </h1>
            </div>
          </div>

          <button onClick={handleDownload}>
            <DownloadIcon />
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}
