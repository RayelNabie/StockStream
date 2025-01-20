import { Inventory } from "../models/Inventory";

const getInventory = async () => {
  try {
    const inventoryData = await Inventory.find({});
    return inventoryData;
  } catch {
    console.error("Error fetching feedback data:", error);
    throw new Error("Database fetch error");
  }
};
