// Lokaal array om receiptNumbers op te slaan
const receiptNumbers = { lastReceiptNumber: 0 };

function getNextReceiptNumber() {
  receiptNumbers.lastReceiptNumber =
    (receiptNumbers.lastReceiptNumber + 1) % 10000; // Reset naar 0 na 9999
  return receiptNumbers.lastReceiptNumber;
}

export const assignBarcode = async (warehouseNumber) => {
  const startCode = "3910";

  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");

  const leadingZero = "00";

  // const formattedWarehouseNumber = warehouseNumber.toString().padStart(2, "0");

  const receiptNumber = getNextReceiptNumber().toString().padStart(4, "0");
  
  // Combineer alle delen tot een barcode
  const barcode = `${startCode}${year}${month}${day}${hour}${minute}${leadingZero}${receiptNumber}`;

  console.log("Generated Barcode:", barcode);
  return barcode;
};
