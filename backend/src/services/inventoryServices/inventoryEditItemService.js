import mongoose from "mongoose";
import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";
import { info, error } from "../../utils/logger.js";

export const editInventoryItemService = async (id, data) => {
  try {
    // ✅ **Stap 1: Controleer of de ID een geldig MongoDB ObjectId is**
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { status: 400, message: "Ongeldige ID opgegeven." };
    }

    // ✅ **Stap 2: Haal bestaand item op**
    const existingItem = await Inventory.findById(id);
    if (!existingItem) {
      return { status: 404, message: "Inventarisitem niet gevonden." };
    }

    // ✅ **Stap 3: Voer update uit met Mongoose (PUT: volledige vervanging)**
    const updatedItem = await Inventory.findOneAndReplace({ _id: id }, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return { status: 500, message: "Fout bij bijwerken van inventarisitem." };
    }

    // ✅ **Stap 4: HAL JSON response genereren**
    const baseUrl = `${envConfig.serverUrl}/inventory`;

    return {
      httpStatus: 200,
      id: updatedItem._id.toString(),
      name: updatedItem.name,
      description: updatedItem.description || null,
      quantity: updatedItem.quantity,
      category: updatedItem.category || null,
      supplier: updatedItem.supplier || null,
      location: updatedItem.location || null,
      sku: updatedItem.sku,
      barcode: updatedItem.barcode,
      status: updatedItem.status,
      _links: {
        self: { href: `${baseUrl}/${id}` },
        collection: { href: baseUrl },
      },
    };
  } catch (err) {
    error("[Service] Fout bij bijwerken van inventarisitem", {
      error: err.message,
    });

    return {
      status: 500,
      message: "Interne serverfout bij bijwerken van inventarisitem.",
      error: err.message,
    };
  }
};
