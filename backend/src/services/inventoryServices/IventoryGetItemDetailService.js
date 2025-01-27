import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";

export const getInventoryDetailService = async (id) => {
  const inventoryItem = await Inventory.findById(id);

  if (!inventoryItem) {
    throw new Error("Inventarisitem niet gevonden");
  }

  const baseUrl = `${envConfig.serverUrl}/inventory`; // Use dynamic `baseUrl`

  return {
    ...inventoryItem.toObject(),
    _links: {
      self: { href: `${baseUrl}/${id}` },
      collection: { href: baseUrl },
    },
  };
};