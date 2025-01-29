import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";

export const getInventoryDetailService = async (id) => {
  try {
    // Zoek het item in de database
    const inventoryItem = await Inventory.findById(id);

    if (!inventoryItem) {
      throw new Error("Inventarisitem niet gevonden");
    }

    // Dynamisch de juiste `baseUrl` genereren
    const baseUrl = `${envConfig.serverUrl}/inventory`;

    // Converteer het item naar een HAL-compliant JSON-structuur
    return {
      _links: {
        self: { href: `${baseUrl}/${id}` },
        collection: { href: baseUrl },
      },
      _embedded: {
        item: {
          ...inventoryItem.toObject({ versionKey: false }), // Exclude `__v`
        },
      },
    };
  } catch (err) {
    throw new Error(err.message || "Error fetching inventory item");
  }
};