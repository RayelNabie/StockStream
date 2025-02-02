import { info, debug, error } from "../../utils/logger.js";

let receiptNumbers = { lastReceiptNumber: 0 };

function getNextReceiptNumber() {
  receiptNumbers.lastReceiptNumber =
    (receiptNumbers.lastReceiptNumber + 1) % 10000;
  return receiptNumbers.lastReceiptNumber;
}

export const assignBarcode = async (warehouseNumber) => {
  try {
    debug(`[Service] Barcode genereren gestart voor warehouseNumber: ${warehouseNumber}`);

    if (!Number.isInteger(warehouseNumber) || warehouseNumber < 0) {
      error(`[Service] Ongeldige warehouseNumber ontvangen: ${warehouseNumber}`);
      return {
        status: 400,
        message: "Warehouse number is invalid. It must be a positive integer.",
      };
    }

    const startCode = "3910";
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    const leadingZero = "00";
    const receiptNumber = getNextReceiptNumber().toString().padStart(4, "0");

    const barcode = `${startCode}${year}${month}${day}${hour}${minute}${leadingZero}${receiptNumber}`;

    info(`[Service] Barcode succesvol gegenereerd: ${barcode}`);

    return {
      status: 201,
      barcode,
    };
  } catch (err) {
    error(`[Service] Fout bij genereren van barcode: ${err.message}`);
    return {
      status: 500,
      message: "Interne serverfout bij genereren van barcode.",
      error: err.message,
    };
  }
};