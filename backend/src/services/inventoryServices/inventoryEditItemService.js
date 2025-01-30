import mongoose from "mongoose";
import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";
import { info, error } from "../../utils/logger.js";

export const editInventoryItemService = async (id, data) => {
  try {
    // ✅ **Stap 1: Controleer of de ID een geldig MongoDB ObjectId is**
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { httpStatus: 400, message: "Ongeldige ID opgegeven." };
    }

    // ✅ **Stap 2: Haal bestaand item op**
    const existingItem = await Inventory.findById(id).lean();
    if (!existingItem) {
      return { httpStatus: 404, message: "Inventarisitem niet gevonden." };
    }

    // ✅ **Stap 3: Maak een nieuw object met ALLEEN de velden uit `data`**
    const newItem = {
      name: data.name || null,
      description: data.description || null,
      quantity: data.quantity || null,
      category: data.category || null,
      supplier: data.supplier || null,
      location: data.location || null,
      sku: data.sku || null,
      barcode: data.barcode || null,
      status: data.status || null,
    };

    // ✅ **Stap 4: Vervang de oude resource met de nieuwe (findOneAndReplace)**
    const replacedItem = await Inventory.findOneAndReplace(
      { _id: id }, // Zoek het bestaande document op
      newItem, // **Volledige vervanging met alleen nieuwe data**
      { new: true, runValidators: true }
    );

    if (!replacedItem) {
      return { httpStatus: 500, message: "Fout bij vervangen van inventarisitem." };
    }

    // ✅ **Stap 5: HAL JSON response genereren**
    const baseUrl = `${envConfig.serverUrl}/inventory`;

    return {
      httpStatus: 200,
      id: replacedItem._id.toString(),
      name: replacedItem.name,
      description: replacedItem.description,
      quantity: replacedItem.quantity,
      category: replacedItem.category,
      supplier: replacedItem.supplier,
      location: replacedItem.location,
      sku: replacedItem.sku,
      barcode: replacedItem.barcode,
      status: replacedItem.status,
      _links: {
        self: { href: `${baseUrl}/${id}` },
        collection: { href: baseUrl },
      },
    };
  } catch (err) {
    error("[Service] Fout bij vervangen van inventarisitem", { error: err.message });

    return {
      httpStatus: 500,
      message: "Interne serverfout bij vervangen van inventarisitem.",
      error: err.message,
    };
  }
};