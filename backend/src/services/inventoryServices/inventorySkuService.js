import { Inventory } from "../../models/Inventory.js";
import { info, error } from "../../utils/logger.js";

export const generateUniqueSku = async (categoryCode) => {
  try {
    // ✅ **Stap 1: Valideer invoer**
    if (
      !categoryCode ||
      typeof categoryCode !== "string" ||
      categoryCode.trim() === ""
    ) {
      throw new Error("Categoriecode is verplicht en moet een string zijn.");
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");

    const truncatedCategoryCode = categoryCode.slice(0, 4).toUpperCase();
    const baseSku = `${truncatedCategoryCode}-${year}${month}${day}`;

    let nextNumber = 1;

    // ✅ **Stap 2: Zoek de laatst gegenereerde SKU**
    const lastSkuEntry = await Inventory.findOne(
      { sku: { $regex: `^${baseSku}-\\d+$` } },
      { sku: 1 }
    )
      .sort({ sku: -1 }) // Sorteer aflopend om de laatste SKU te krijgen
      .limit(1);

    if (lastSkuEntry) {
      const lastNumber = parseInt(lastSkuEntry.sku.split("-").pop(), 10);
      nextNumber = lastNumber + 1;
    }

    // ✅ **Stap 3: Controleer of de nieuwe SKU echt uniek is**
    let newSku;
    let attempts = 0;
    const maxAttempts = 10; // **Voorkom oneindige loops bij fouten**

    while (attempts < maxAttempts) {
      newSku = `${baseSku}-${nextNumber.toString().padStart(5, "0")}`;
      const existingSku = await Inventory.findOne({ sku: newSku });

      if (!existingSku) {
        break; // **Stop als de SKU niet in gebruik is**
      }

      nextNumber++; // **Anders, verhoog het nummer en probeer opnieuw**
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error("Kon geen unieke SKU genereren na meerdere pogingen.");
    }

    // ✅ **Stap 4: Log succesvolle generatie**
    info("[Service] Unieke SKU gegenereerd", { sku: newSku });

    return newSku;
  } catch (err) {
    error("[Service] Fout bij genereren van SKU", { error: err.message });
    throw new Error(`Fout bij SKU-generatie: ${err.message}`);
  }
};
