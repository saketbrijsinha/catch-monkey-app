import moment from "moment";
import * as base64 from "base-64";
import * as Crypto from "crypto-js";
import * as utf8 from "utf8";

export const CalcWidthValue = (value, windowWidth) => {
  return (value * windowWidth) / 1920;
};

export const dateFormat = "DD/MM/YYYY";
export const monthYearFormat = "MM/YYYY";

export const handleSetValueInList = (
  keyNeedToChange,
  index,
  value,
  fieldList,
  setFieldList
) => {
  let currentList = [...fieldList];
  currentList[index][keyNeedToChange] = value;

  setFieldList(currentList);
};

export const getDateRange = (firstDate, lastDate) => {
  if (
    moment(firstDate, "YYYY-MM-DD").isSame(
      moment(lastDate, "YYYY-MM-DD"),
      "day"
    )
  )
    return [lastDate];
  let date = firstDate;
  const dates = [date];
  do {
    date = moment(date).add(1, "day");
    dates.push(date.format("YYYY-MM-DD"));
  } while (moment(date).isBefore(lastDate));
  return dates;
};

export const isNumber = (number) => !isNaN(number) || "Must be a number";

export const isAlphanumeric = (input) =>
  /^[a-zA-Z0-9]+$/.test(input) || "Must be alphanumeric";

export const b64 = (value, purpose = "enc", dataType = "") => {
  if (purpose === "enc") {
    if (dataType === "string") {
      const stringifyValue = JSON.stringify(value);
      const bytes = utf8.encode(stringifyValue);
      const encoded = base64.encode(bytes);
      return encoded;
    } else {
      const bytes = utf8.encode(value);
      const encoded = base64.encode(bytes);
      return encoded;
    }
  }

  if (purpose === "dec") {
    const bytes = base64.decode(value);
    const decoded = utf8.decode(bytes);
    if (dataType === "parsed") {
      const parsedDecoded = JSON.parse(decoded);
      return parsedDecoded;
    } else {
      return decoded;
    }
  }
};

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const convertFileToBase64 = async (selectedFile) => {
  try {
    const result = await fileToBase64(selectedFile);
    return result;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const a256 = (value, purpose = "enc", isParsed = true) => {
  if (purpose === "enc") {
    const monkeyStr = JSON.stringify(value);
    const monkenc = Crypto.AES.encrypt(
      monkeyStr || "",
      process.env.REACT_APP_MON_KEY
    ).toString();

    const monkeyb64 = b64(monkenc);

    return monkeyb64;
  }

  if (purpose === "dec") {
    const monkeydec = b64(value, "dec");

    if (isParsed) {
      const monkeyorg = JSON.parse(
        Crypto.AES.decrypt(monkeydec, process.env.REACT_APP_MON_KEY).toString(
          Crypto.enc.Utf8
        )
      );

      return monkeyorg;
    } else {
      const monkeyorg = Crypto.AES.decrypt(
        monkeydec,
        process.env.REACT_APP_MON_KEY
      ).toString(Crypto.enc.Utf8);

      return monkeyorg;
    }
  }
};

export const convertDate = (str, isReverse = false) => {
  let selectedDate = str;
  if (isReverse) {
    selectedDate = selectedDate.split("/").reverse().join("/");
  }
  var date = new Date(selectedDate),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);

  return { date, mnth, day };
};

export const defaultImageIcon = (value) => {};

export const isArrayHasDuplicateValues = (selectedArray) => {
  if (selectedArray?.length === 0 || selectedArray?.length === 1) return false;
  const set = new Set(selectedArray);
  return set?.size !== selectedArray?.length;
};
