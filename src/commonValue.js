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

/**
 * Performs AES-256 encryption or decryption on a given value.
 * The encryption process involves stringifying the input, encrypting it with AES-256,
 * and then Base64 encoding the encrypted result.
 * The decryption process involves Base64 decoding the input, decrypting it,
 * and then attempting to parse the result as JSON if `isParsed` is true.
 *
 * Relies on the `REACT_APP_MON_KEY` environment variable for the encryption/decryption key.
 * Ensure this environment variable is set.
 *
 * @param {any} value The value to encrypt or decrypt. For encryption, it will be stringified.
 * @param {string} [purpose="enc"] Determines the operation: "enc" for encryption, "dec" for decryption.
 * @param {boolean} [isParsed=true] For decryption, if true, attempts to JSON.parse the decrypted string.
 *                                   If false, or if parsing fails, returns the raw decrypted string.
 *                                   Note: If decryption itself fails, an error string might be returned from crypto-js.
 * @returns {any} The encrypted string (Base64 encoded), the decrypted JSON object,
 *                or the decrypted string (if not parsed or parsing failed), or an error string.
 */
export const a256 = (value, purpose = "enc", isParsed = true) => {
  const secretKey = process.env.REACT_APP_MON_KEY;
  if (!secretKey) {
    console.error("Encryption key (REACT_APP_MON_KEY) is not set.");
    return "Error: Encryption key missing.";
  }

  if (purpose === "enc") {
    try {
      // Ensure the value is stringified before encryption, as AES works on strings.
      const stringToEncrypt = typeof value === 'string' ? value : JSON.stringify(value);
      const encrypted = Crypto.AES.encrypt(
        stringToEncrypt,
        secretKey
      ).toString();
      // Base64 encode the encrypted string for easier handling/storage.
      return b64(encrypted, "enc"); // b64 handles utf8 encoding before base64
    } catch (error) {
      console.error("Encryption failed:", error);
      return "Error: Encryption process failed.";
    }
  }

  if (purpose === "dec") {
    try {
      // Base64 decode the input value first.
      const base64Decoded = b64(value, "dec");
      if (!base64Decoded) { // Check if b64 decoding failed (e.g. invalid base64 string)
          return "Error: Invalid input string for decryption (Base64 decode failed).";
      }

      // Decrypt the Base64 decoded string.
      const decryptedBytes = Crypto.AES.decrypt(base64Decoded, secretKey);
      const decryptedString = decryptedBytes.toString(Crypto.enc.Utf8);

      if (!decryptedString) {
        // This can happen if the key is wrong or the message is corrupted,
        // leading to an empty string after decryption attempt.
        return "Error: Decryption failed (empty result - check key or input validity).";
      }

      if (isParsed) {
        try {
          // Attempt to parse the decrypted string as JSON.
          const parsedJson = JSON.parse(decryptedString);
          return parsedJson;
        } catch (parseError) {
          // If JSON parsing fails, return the raw decrypted string.
          // This means the original data was not a JSON string.
          return decryptedString;
        }
      } else {
        // If isParsed is false, return the raw decrypted string.
        return decryptedString;
      }
    } catch (error) {
      console.error("Decryption failed:", error);
      // General error during decryption process (e.g., malformed cryptoJS object from b64)
      return "Error: Decryption process failed.";
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
