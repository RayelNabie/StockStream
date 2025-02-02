import mongoose from "mongoose";
import { Inventory } from "../../models/Inventory.js";
import { info, debug, error } from "../../utils/logger.js";

export const deleteInventoryItemService = async (id) => {
  try {
    debug("[Service] Start verwijderproces voor inventarisitem", { id });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      info("[Service] Ongeldige ObjectId ontvangen", { id });
      return { status: 400, message: "Ongeldige ID opgegeven" };
    }

    const existingItem = await Inventory.findById(id);
    if (!existingItem) {
      info("[Service] Inventarisitem niet gevonden", { id });
      return { status: 404, message: "Inventarisitem niet gevonden" };
    }

    await Inventory.findByIdAndDelete(id);
    info("[Service] Inventarisitem succesvol verwijderd", { id });

    return { status: 204 };
  } catch (err) {
    error("[Service] Fout bij verwijderen van inventarisitem", { error: err.message });

    return { status: 500, message: `Fout bij verwijderen: ${err.message}` };
  }
};