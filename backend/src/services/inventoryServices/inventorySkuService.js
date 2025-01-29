import { Inventory } from "../../models/Inventory.js";

export const generateUniqueSku = async (categoryCode) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");

  const truncatedCategoryCode = categoryCode.slice(0, 4).toUpperCase();
  const baseSku = `${truncatedCategoryCode}-${year}${month}${day}`;

  let nextNumber = 1;
  let newSku = `${baseSku}-${nextNumber.toString().padStart(5, "0")}`;

  // **Stap 1: Zoek de laatst gegenereerde SKU voor dit patroon**
  const lastSkuEntry = await Inventory.findOne(
    { sku: { $regex: `^${baseSku}-\\d+$` } },
    { sku: 1 }
  )
    .sort({ sku: -1 })
    .limit(1);

  if (lastSkuEntry) {
    const lastNumber = parseInt(lastSkuEntry.sku.split("-").pop(), 10);
    nextNumber = lastNumber + 1;
  }

  // **Stap 2: Zorg ervoor dat de SKU écht uniek is**
  do {
    newSku = `${baseSku}-${nextNumber.toString().padStart(5, "0")}`;
    const existingSku = await Inventory.findOne({ sku: newSku });
    if (!existingSku) break; // **Stop als de SKU niet in gebruik is**
    nextNumber++; // **Anders, verhoog het nummer en probeer opnieuw**
  } while (true);

  return newSku;
};