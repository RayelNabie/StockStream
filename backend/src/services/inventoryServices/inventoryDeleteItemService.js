import mongoose from "mongoose";
import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";
import { info, error } from "../../utils/logger.js";

export const deleteInventoryItemService = async (id) => {
  try {
    // **Stap 1: Controleer of de ID een geldig MongoDB ObjectId is**
    if (!mongoose.Types.ObjectId.isValid(id)) {
      info("[Service] Ongeldige ObjectId ontvangen", { id });
      return { notFound: true };
    }

    // **Stap 2: Probeer het item te vinden vóór verwijderen**
    const existingItem = await Inventory.findById(id);
    if (!existingItem) {
      info("[Service] Inventarisitem niet gevonden", { id });
      return { notFound: true };
    }

    // **Stap 3: Verwijder het item**
    await Inventory.findByIdAndDelete(id);
    info("[Service] Inventarisitem succesvol verwijderd", { id });

    // **Stap 4: Geef een succesvol resultaat terug**
    return { success: true };
  } catch (err) {
    error("[Service] Fout bij verwijderen van inventarisitem", {
      error: err.message,
    });
    throw new Error(`Fout bij verwijderen van item: ${err.message}`);
  }
};