import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";

export const updateInventoryItemService = async (id, data) => {
  try {
    // **PATCH: Alleen opgegeven velden updaten, de rest blijft behouden**
    const updatedItem = await Inventory.findByIdAndUpdate(id, data, {
      new: true, // Geeft het bijgewerkte document terug
      runValidators: true, // Zorgt ervoor dat de data nog steeds geldig is
    });

    if (!updatedItem) {
      throw new Error("Inventory item not found.");
    }

    // **HAL JSON response genereren**
    const baseUrl = `${envConfig.serverUrl}/inventory`;

    return {
      ...updatedItem.toObject({ versionKey: false }), // Exclude `__v`
      _links: {
        self: { href: `${baseUrl}/${id}` },
        collection: { href: baseUrl },
      },
    };
  } catch (err) {
    throw new Error(err.message || "Error updating inventory item");
  }
};