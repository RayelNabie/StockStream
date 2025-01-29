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

    // Converteer het item naar een HAL JSON-structuur, met correcte mapping
    return {
      id: inventoryItem._id.toString(), // Zet MongoDB ObjectId om naar string
      name: inventoryItem.name, // Productnaam blijft hetzelfde
      description: inventoryItem.description, // Beschrijving van product
      sku: inventoryItem.sku, // SKU behouden
      quantity: inventoryItem.quantity, // Aantal producten in voorraad
      category: inventoryItem.category, // Categorie blijft gelijk
      supplier: inventoryItem.supplier, // Leverancier blijft gelijk
      status: inventoryItem.status, // Status behouden (true/false)
      barcode: inventoryItem.barcode, // Barcode behouden
      location: inventoryItem.location, // Locatie in het magazijn
      createdAt: inventoryItem.createdAt.toISOString(), // Datum van aanmaak in correct formaat
      updatedAt: inventoryItem.updatedAt.toISOString(), // Datum van update in correct formaat
      _links: {
        self: { href: `${baseUrl}/${inventoryItem._id}` }, // Link naar zichzelf
        collection: { href: baseUrl }, // Link naar de collectie
      },
    };
  } catch (err) {
    throw new Error(err.message || "Error fetching inventory item");
  }
};