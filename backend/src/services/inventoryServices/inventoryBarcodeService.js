import { info, error } from "../../utils/logger.js";

// Lokaal object om receiptNumbers op te slaan
let receiptNumbers = { lastReceiptNumber: 0 };

function getNextReceiptNumber() {
  receiptNumbers.lastReceiptNumber =
    (receiptNumbers.lastReceiptNumber + 1) % 10000; // Reset naar 0 na 9999
  return receiptNumbers.lastReceiptNumber;
}

export const assignBarcode = async (warehouseNumber) => {
  try {
    // ✅ **Stap 1: Controleer of `warehouseNumber` geldig is**
    if (!Number.isInteger(warehouseNumber) || warehouseNumber < 0) {
      error("[Service] Ongeldige warehouseNumber ontvangen", { warehouseNumber });

      return {
        status: 400, // **Bad Request**
        message: "Warehouse number is invalid. It must be a positive integer.",
      };
    }

    const startCode = "3910";

    // ✅ **Stap 2: Genereer datum en tijd voor barcode**
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");

    const leadingZero = "00";

    // ✅ **Stap 3: Genereer ontvangstnummer (reset bij 9999)**
    const receiptNumber = getNextReceiptNumber().toString().padStart(4, "0");

    // ✅ **Stap 4: Combineer alle delen tot een barcode**
    const barcode = `${startCode}${year}${month}${day}${hour}${minute}${leadingZero}${receiptNumber}`;

    info("[Service] Barcode succesvol gegenereerd", { barcode });

    // ✅ **Stap 5: Retourneer barcode als string met statuscode**
    return {
      status: 201, // **Created**
      barcode,
    };
  } catch (err) {
    error("[Service] Fout bij genereren van barcode", { error: err.message });

    return {
      status: 500, // **Internal Server Error**
      message: "Interne serverfout bij genereren van barcode.",
      error: err.message,
    };
  }
};