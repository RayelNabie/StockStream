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

export const assignBarcode = async () => {
  //startcode
  //jaartal
  //maand
  //dag
  //uur
  //Leading Zero's
  //Loodsnummer
  //bonnummer van de dag, auto increment

  const createBarcode = [0, 0, 0, 0];
  const date_time = Date();
  console.log(date_time);
  createBarcode.push(0,0,0,0)
  //loodsnummer


  
};

export async function validateInventoryData(data) {
  const errors = [];
  const uniqueness = {}; // Object om unieke validaties bij te houden

  // Helperfunctie om validaties uit te voeren
  const validateField = (field, condition, errorMessage) => {
    if (!condition) {
      errors.push({ field, message: errorMessage });
    }
  };

  // Vereiste velden
  validateField(
    "name",
    data.name && typeof data.name === "string" && data.name.trim() !== "",
    "Name is required and must be a non-empty string."
  );
  validateField(
    "sku",
    data.sku && typeof data.sku === "string" && data.sku.trim() !== "",
    "SKU is required and must be a non-empty string."
  );
  validateField(
    "quantity",
    data.quantity !== undefined &&
      typeof data.quantity === "number" &&
      data.quantity >= 0,
    "Quantity must be a non-negative number."
  );
  validateField(
    "price",
    data.price !== undefined &&
      typeof data.price === "number" &&
      data.price >= 0,
    "Price must be a non-negative number."
  );
  validateField(
    "status",
    data.status !== undefined && typeof data.status === "boolean",
    "Status must be a boolean."
  );

  // Optionele velden
  validateField(
    "description",
    !data.description || typeof data.description === "string",
    "Description must be a string."
  );
  validateField(
    "category",
    !data.category || typeof data.category === "string",
    "Category must be a string."
  );
  validateField(
    "supplier",
    !data.supplier || typeof data.supplier === "string",
    "Supplier must be a string."
  );
  validateField(
    "lowStockThreshold",
    data.lowStockThreshold === undefined ||
      (typeof data.lowStockThreshold === "number" &&
        data.lowStockThreshold >= 0),
    "Low stock threshold must be a non-negative number."
  );
  validateField(
    "barcode",
    !data.barcode || typeof data.barcode === "string",
    "Barcode must be a string."
  );
  validateField(
    "location",
    !data.location || typeof data.location === "string",
    "Location must be a string."
  );

  // Controleer uniekheid van `name`
  if (data.name) {
    const existingByName = await Inventory.findOne({ name: data.name });
    uniqueness.name = !existingByName;
    if (existingByName) {
      errors.push({ field: "name", message: "Name must be unique." });
    }
  }

  //controleer uniekheid van sku
  if (data.sku) {
    const existingBySku = await Inventory.findOne({ sku: data.sku });
    uniqueness.sku = !existingBySku;
    if (existingBySku) {
      errors.push({ field: "sku", message: "Sku must be unique." });
    }
  }

  // Controleer uniekheid van `barcode`
  if (data.barcode) {
    const existingByBarcode = await Inventory.findOne({
      barcode: data.barcode,
    });
    uniqueness.barcode = !existingByBarcode;
    if (existingByBarcode) {
      errors.push({ field: "barcode", message: "Barcode must be unique." });
    }
  }

  // Log validatiefouten
  if (errors.length > 0) {
    error("Validatiefouten aangetroffen", { errors });
  }

  // Retourneer JSON-respons
  return {
    errors, // Lijst met validatiefouten
    uniqueness, // Resultaat van unieke veldvalidaties
    isValid: errors.length === 0, // Boolean om aan te geven of alles geldig is
  };
}
