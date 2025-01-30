import { Inventory } from "../../models/Inventory.js";
import { info, error } from "../../utils/logger.js";

export const generateUniqueSku = async (categoryCode) => {
  try {
    if (!categoryCode || typeof categoryCode !== "string" || categoryCode.trim() === "") {
      error("[Service] Ongeldige categoriecode ontvangen", { categoryCode });
      return {
        status: 400,
        message: "Categoriecode is verplicht en moet een geldige string zijn.",
      };
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");

    const truncatedCategoryCode = categoryCode.slice(0, 4).toUpperCase();
    const baseSku = `${truncatedCategoryCode}-${year}${month}${day}`;

    let nextNumber = 1;

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

    let newSku;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      newSku = `${baseSku}-${nextNumber.toString().padStart(5, "0")}`;
      const existingSku = await Inventory.findOne({ sku: newSku });

      if (!existingSku) {
        break;
      }

      nextNumber++;
      attempts++;
    }

    if (attempts >= maxAttempts) {
      error("[Service] SKU-generatie mislukt na meerdere pogingen");
      return {
        status: 500, 
        message: "Kon geen unieke SKU genereren na meerdere pogingen.",
      };
    }

    info("[Service] Unieke SKU gegenereerd", { sku: newSku });

    return {
      status: 201,
      sku: newSku,
    };
  } catch (err) {
    error("[Service] Fout bij genereren van SKU", { error: err.message });

    return {
      status: 500,
      message: "Interne serverfout bij SKU-generatie.",
      error: err.message,
    };
  }
};