import { Inventory } from "../models/Inventory.js";

export const getInventory = async () => {
  try {
    //
  } catch {
    //
  }
};

export const getAllInventory = async () => {
  try {
    const inventoryData = await Inventory.find({});
    return inventoryData;
  } catch {
    console.error("Error fetching feedback data:", error);
    throw new Error("Database fetch error");
  }
};

export const createNewInverntoryItem = async () => {
  try {
    //
  } catch {
    //
  }
};

export const editInventoryItem = async () => {
  try {
    //
  } catch {
    //
  }
};

export const updateInventroyItem = async () => {
  try {
    //
  } catch {
    //
  }
};
