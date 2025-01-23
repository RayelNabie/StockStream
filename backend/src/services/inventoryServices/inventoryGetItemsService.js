import { Inventory } from "../../models/Inventory.js";

export const getInventoryItemsService = async (query) => {
  const limit = parseInt(query.limit, 10) || 10;
  const page = parseInt(query.page, 10) || 1;
  const skip = (page - 1) * limit;

  const items = await Inventory.find({}).skip(skip).limit(limit);
  const totalItems = await Inventory.countDocuments();

  return { items, totalItems, limit, page };
};