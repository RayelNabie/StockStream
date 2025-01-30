import mongoose from "mongoose";
import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";
import { info, error } from "../../utils/logger.js";

export const getInventoryDetailService = async (id) => {
  try {
    // ✅ **Stap 1: Controleer of de ID een geldig MongoDB ObjectId is**
    if (!mongoose.Types.ObjectId.isValid(id)) {
      info("[Service] Ongeldige ObjectId ontvangen", { id });
      return { status: 400, message: "Ongeldige ID opgegeven" };
    }

    // ✅ **Stap 2: Zoek het item in de database**
    const inventoryItem = await Inventory.findById(id);
    if (!inventoryItem) {
      info("[Service] Inventarisitem niet gevonden", { id });
      return { status: 404, message: "Inventarisitem niet gevonden" };
    }

    // ✅ **Stap 3: Dynamisch de juiste `baseUrl` genereren**
    const baseUrl = `${envConfig.serverUrl}/inventory`;

    // ✅ **Stap 4: Return JSON in HAL-format**
    return {
      status: 200, // OK
      item: {
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
      },
    };
  } catch (err) {
    error("[Service] Fout bij ophalen van inventarisitem", {
      error: err.message,
    });

    return {
      status: 500,
      message: "Interne serverfout bij ophalen van inventarisitem",
      error: err.message,
    };
  }
};