import { Inventory } from "../../models/Inventory.js";

export const updateInventoryItemService = async (id, data) => {
  const updatedItem = await Inventory.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!updatedItem) {
    throw new Error("Inventory item not found.");
  }

  return updatedItem;
};
