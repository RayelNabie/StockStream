import { Inventory } from "../../models/Inventory.js";

export const getInventoryDetailService = async (id) => {
    const inventoryItem = await Inventory.findById(id);
  
    if (!inventoryItem) {
      throw new Error("Inventarisitem niet gevonden");
    }
  
    return inventoryItem.toObject();
  };