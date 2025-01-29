import mongoose from "mongoose";
import { Inventory } from "../../models/Inventory.js";
import { info, error } from "../../utils/logger.js";

export const deleteInventoryItemService = async (id) => {
  try {
    // ✅ **Stap 1: Controleer of de ID een geldig MongoDB ObjectId is**
    if (!mongoose.Types.ObjectId.isValid(id)) {
      info("[Service] Ongeldige ObjectId ontvangen", { id });
      return { status: 400, message: "Ongeldige ID opgegeven" };
    }

    // ✅ **Stap 2: Controleer of het item bestaat vóór verwijderen**
    const existingItem = await Inventory.findById(id);
    if (!existingItem) {
      info("[Service] Inventarisitem niet gevonden", { id });
      return { status: 404, message: "Inventarisitem niet gevonden" };
    }

    // ✅ **Stap 3: Verwijder het item**
    await Inventory.findByIdAndDelete(id);
    info("[Service] Inventarisitem succesvol verwijderd", { id });

    // ✅ **Stap 4: Geef een succesvol resultaat terug**
    return { status: 204 }; // No Content
  } catch (err) {
    error("[Service] Fout bij verwijderen van inventarisitem", {
      error: err.message,
    });

    return { status: 500, message: `Fout bij verwijderen: ${err.message}` };
  }
};