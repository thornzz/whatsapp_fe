import moment from "moment";
require("moment/locale/tr");

export const dateHandler = (date) => {
  let now = moment();
  let momentDate = moment(date);
  let time = momentDate.fromNow(true);
  let dateByHourAndMin = momentDate.format("HH:mm");
  const getDay = () => {
    let days = time.split(" ")[0];
    if (Number(days) < 8) {
      return now.subtract(Number(days), "days").format("dddd");
    } else {
      return momentDate.format("DD/MM/YYYY");
    }
  };
  if (time === "a few seconds") {
    return "Şimdi";
  }
  if (time.search("minute") !== -1) {
    let mins = time.split(" ")[0];
    if (mins === "a") {
      return "1 dakika önce";
    } else {
      return `${mins} dakika önce`;
    }
  }
  if (time.search("hour") !== -1) {
    return dateByHourAndMin;
  }
  if (time === "a day") {
    return "Dün";
  }
  if (time.search("days") !== -1) {
    return getDay();
  }
  return time;
};

export function tarihFormatla(tarih) {
  let girilenTarih = moment(tarih);
  let simdi = moment();

  if (simdi.isSame(girilenTarih, "day")) {
    return "Bugün";
  } else if (simdi.subtract(1, "days").isSame(girilenTarih, "day")) {
    return "Dün";
  } else if (simdi.diff(girilenTarih, "days") <= 4) {
    return girilenTarih.locale("tr").format("dddd");
  } else {
    return girilenTarih.format("DD.MM.YYYY");
  }
}
