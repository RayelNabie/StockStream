import { Inventory } from "../models/Inventory.js";
import { info, error } from "../utils/logger.js";
import { ValidationError } from "../config/errors.js";

/**
 * Functie om een nieuw inventarisitem aan te maken.
 * @param {Object} data - De gegevens van het inventarisitem.
 * @returns {Object} Het opgeslagen inventarisitem.
 * @throws {ValidationError|Error} Bij validatiefouten of databasefouten.
 */
export const createInventoryItem = async (data) => {
  try {
    const newItem = new Inventory(data);
    const savedItem = await newItem.save();

    info("Inventarisitem succesvol aangemaakt", { itemId: savedItem._id });
    return savedItem;
  } catch (err) {
    error("Fout bij aanmaken van inventarisitem", { error: err.message });
    throw new Error(`Databasefout: ${err.message}`);
  }
};

/**
 * Valideert de gegevens van een inventarisitem.
 * @param {Object} data - De te valideren gegevens.
 * @throws {ValidationError} Als validatie faalt.
 */
export function validateInventoryData(data) {
  const errors = [];

  // Helperfunctie om validaties uit te voeren
  const validateField = (field, condition, errorMessage) => {
    if (!condition) {
      errors.push({ field, message: errorMessage });
    }
  };

  // Vereiste velden
  validateField("name", data.name && typeof data.name === "string" && data.name.trim() !== "", "Name is required and must be a non-empty string.");
  validateField("sku", data.sku && typeof data.sku === "string" && data.sku.trim() !== "", "SKU is required and must be a non-empty string.");
  validateField("quantity", data.quantity !== undefined && typeof data.quantity === "number" && data.quantity >= 0, "Quantity must be a non-negative number.");
  validateField("price", data.price !== undefined && typeof data.price === "number" && data.price >= 0, "Price must be a non-negative number.");
  validateField("status", data.status !== undefined && typeof data.status === "boolean", "Status must be a boolean.");

  // Optionele velden
  validateField("description", !data.description || typeof data.description === "string", "Description must be a string.");
  validateField("category", !data.category || typeof data.category === "string", "Category must be a string.");
  validateField("supplier", !data.supplier || typeof data.supplier === "string", "Supplier must be a string.");
  validateField("lowStockThreshold", data.lowStockThreshold === undefined || (typeof data.lowStockThreshold === "number" && data.lowStockThreshold >= 0), "Low stock threshold must be a non-negative number.");
  validateField("barcode", !data.barcode || typeof data.barcode === "string", "Barcode must be a string.");
  validateField("location", !data.location || typeof data.location === "string", "Location must be a string.");

  // Fouten teruggeven of exception gooien
  if (errors.length > 0) {
    error("Validatiefouten aangetroffen", { errors });
    throw new ValidationError("Validation failed", errors);
  }
}
