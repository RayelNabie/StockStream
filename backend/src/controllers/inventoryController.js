import { Inventory } from "../models/Inventory.js";
import { info, debug, error } from "../utils/logger.js";


export const getInventory = async () => {
  try {
    //
  } catch {
    //
  }
};

// Haal alle voorraaditems op
export const getAllInventory = async () => {
  try {
    info("[Controller] Ophalen van alle voorraaditems gestart");
    const inventory = await Inventory.find({});
    debug(`[Controller] Voorraad opgehaald: ${JSON.stringify(inventory)}`);
    return inventory;
  } catch (err) {
    error(`[Controller] Fout bij ophalen van voorraad: ${err.message}`);
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
