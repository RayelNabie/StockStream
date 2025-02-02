import mongoose from "mongoose";
import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";
import { info, debug, error } from "../../utils/logger.js";

export const getInventoryDetailService = async (id) => {
  debug("[Service] Start ophalen van inventarisitem", { id });

  if (!mongoose.isValidObjectId(id)) {
    info("[Service] Ongeldige ObjectId ontvangen", { id });
    throw new Error("400|Ongeldige ID opgegeven");
  }

  const inventoryItem = await Inventory.findById(id).lean();
  if (!inventoryItem) {
    info("[Service] Inventarisitem niet gevonden", { id });
    throw new Error("404|Inventarisitem niet gevonden");
  }

  debug("[Service] Inventarisitem gevonden", { inventoryItem });

  const baseUrl = `${envConfig.serverUrl}/inventory`;

  info("[Service] Inventarisitem succesvol opgehaald", { id });

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