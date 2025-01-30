import mongoose from "mongoose";
import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";
import { info, error } from "../../utils/logger.js";

export const getInventoryDetailService = async (id) => {
  // ✅ **Stap 1: Controleer of de ID een geldig MongoDB ObjectId is**
  if (!mongoose.isValidObjectId(id)) {
    info("[Service] Ongeldige ObjectId ontvangen", { id });
    throw new Error("400|Ongeldige ID opgegeven"); // **Foutmelding met statuscode**
  }

  // ✅ **Stap 2: Zoek het item in de database**
  const inventoryItem = await Inventory.findById(id).lean();
  if (!inventoryItem) {
    info("[Service] Inventarisitem niet gevonden", { id });
    throw new Error("404|Inventarisitem niet gevonden"); // **Foutmelding met statuscode**
  }

  // ✅ **Stap 3: Dynamisch de juiste `baseUrl` genereren**
  const baseUrl = `${envConfig.serverUrl}/inventory`;

  // ✅ **Stap 4: Return JSON in HAL-format**
  return {
    id: inventoryItem._id.toString(),
    name: inventoryItem.name,
    description: inventoryItem.description || null,
    sku: inventoryItem.sku,
    quantity: inventoryItem.quantity,
    category: inventoryItem.category || null,
    supplier: inventoryItem.supplier || null,
    status: inventoryItem.status,
    barcode: inventoryItem.barcode,
    location: inventoryItem.location || null,
    createdAt: inventoryItem.createdAt.toISOString(),
    updatedAt: inventoryItem.updatedAt.toISOString(),
    _links: {
      self: { href: `${baseUrl}/${inventoryItem._id}` },
      collection: { href: baseUrl },
    },
  };
};