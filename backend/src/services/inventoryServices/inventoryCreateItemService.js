import { Inventory } from "../../models/Inventory.js";
import { info, error } from "../../utils/logger.js";
import { envConfig } from "../../config/env.js";

export const createInventoryItem = async (data) => {
  try {
    const newItem = new Inventory(data);
    const savedItem = await newItem.save(); // Correct opslaan in MongoDB

    // **Log de succesvolle aanmaak**
    info("[Service] Inventarisitem succesvol aangemaakt", {
      itemId: savedItem._id,
    });

    // **Bepaal de base URL voor links**
    const baseUrl = `${envConfig.serverUrl}/inventory`;

    // **Format de output zoals in GET**
    return {
      id: savedItem._id.toString(), // Zorgt dat `_id` een string is
      name: savedItem.name,
      description: savedItem.description,
      sku: savedItem.sku,
      quantity: savedItem.quantity,
      category: savedItem.category,
      supplier: savedItem.supplier,
      status: savedItem.status,
      barcode: savedItem.barcode,
      location: savedItem.location,
      createdAt: savedItem.createdAt,
      updatedAt: savedItem.updatedAt,
      _links: {
        self: { href: `${baseUrl}/${savedItem._id}` },
        collection: { href: baseUrl },
      },
    };
  } catch (err) {
    error("[Service] Fout bij aanmaken van inventarisitem", { error: err.message });
    throw new Error(`Databasefout: ${err.message}`);
  }
};