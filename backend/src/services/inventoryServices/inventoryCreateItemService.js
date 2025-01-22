import { Inventory } from "../../models/Inventory.js";
import { info, error } from "../../utils/logger.js";

export const createInventoryItem = async (data) => {
    try {
      const newItem = new Inventory(data);
      const savedItem = await newItem.save();
  
      info("[Service] Inventarisitem succesvol aangemaakt", {
        itemId: savedItem._id,
      });
      return savedItem;
    } catch (err) {
      error("[Service] Fout bij aanmaken van inventarisitem", {
        error: err.message,
      });
      throw new Error(`Databasefout: ${err.message}`);
    }
  };