import { Inventory } from "../../models/Inventory.js";

export async function validateInventoryData(data) {
  const errors = [];

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
    data.quantity && typeof data.quantity === "string" && data.quantity.trim() !== "",
    "Quantity is required and must be a non-empty string."
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
    "barcode",
    !data.barcode || typeof data.barcode === "string",
    "Barcode must be a string."
  );

  validateField(
    "location",
    !data.location || typeof data.location === "string",
    "Location must be a string."
  );

  // Valideer unieke velden zoals `sku` en `barcode`
  if (data.sku) {
    const existingSku = await Inventory.findOne({ sku: data.sku });
    if (existingSku) {
      errors.push({ field: "sku", message: "SKU must be unique." });
    }
  }

  if (data.barcode) {
    const existingBarcode = await Inventory.findOne({ barcode: data.barcode });
    if (existingBarcode) {
      errors.push({ field: "barcode", message: "Barcode must be unique." });
    }
  }

  return {
    errors,
    isValid: errors.length === 0,
  };
}