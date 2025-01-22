import { Inventory } from "../../models/Inventory.js";

export const generateUniqueSku = async (categoryCode) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");

  const truncatedCategoryCode = categoryCode.slice(0, 4).toUpperCase();

  const baseSku = `${truncatedCategoryCode}-${year}${month}${day}`;

  const existingSkus = await Inventory.find({
    sku: new RegExp(`^${baseSku}-\\d+$`),
  })
    .sort({ sku: -1 })
    .limit(1);

  let nextNumber = 1;

  if (existingSkus.length > 0) {
    const lastSku = existingSkus[0].sku;
    const lastNumber = parseInt(lastSku.split("-").pop(), 10);
    nextNumber = lastNumber + 1;
  }

  const newSku = `${baseSku}-${nextNumber.toString().padStart(5, "0")}`;
  return newSku;
};
