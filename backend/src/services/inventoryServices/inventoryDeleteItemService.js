import { Inventory } from "../../models/Inventory.js";
import { info, error } from "../../utils/logger.js";

export const deleteInventoryItemService = async (id) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(id);

    if (!deletedItem) {
      return null; // **404 als het item niet bestaat**
    }

    info("[Service] Inventarisitem succesvol verwijderd", { id });

    return deletedItem;
  } catch (err) {
    error("[Service] Fout bij verwijderen van inventarisitem", { error: err.message });
    throw new Error("Databasefout: " + err.message);
  }
};