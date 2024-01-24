import axios from "axios";

const generateRandomFileName = (mime) => {
  const extension = mime.split("/")[1];
  const randomString = Math.random().toString(36).substring(7);
  return `${randomString}.${extension}`;
};

export const DownloadFile = async (mediaId, filename, mime) => {
  const WABA_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/waba/download`;

  try {
    // Make a POST request to the server to download the file
    const response = await axios.post(
      WABA_ENDPOINT,
      { mediaId },
      { responseType: "blob" }
    );

    // If filename is empty, generate a random filename based on mime type
    const finalFilename = filename || generateRandomFileName(mime);

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", finalFilename);
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("File download failed:", error);
  }
};

export const GetImageURL = async (mediaId, mime) => {
  const WABA_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/waba/download`;

  try {
    // Make a POST request to the server to download the file
    const response = await axios.post(
      WABA_ENDPOINT,
      { mediaId },
      { responseType: "blob" }
    );

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    return url;
  } catch (error) {
    console.error("File download failed:", error);
  }
};
