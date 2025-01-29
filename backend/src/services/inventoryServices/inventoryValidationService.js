import { Inventory } from "../../models/Inventory.js";
import { error } from "../../utils/logger.js";

export async function validateInventoryData(data) {
  const errors = [];

  // ✅ **Helperfunctie om validaties uit te voeren**
  const validateField = (field, condition, errorMessage, statusCode = 400) => {
    if (!condition) {
      errors.push({ field, message: errorMessage, status: statusCode });
    }
  };

  // ✅ **Stap 1: Vereiste velden controleren**
  validateField(
    "name",
    data.name && typeof data.name === "string" && data.name.trim() !== "",
    "Name is required and must be a non-empty string.",
    400
  );

  validateField(
    "sku",
    data.sku && typeof data.sku === "string" && data.sku.trim() !== "",
    "SKU is required and must be a non-empty string.",
    400
  );

  validateField(
    "quantity",
    data.quantity && typeof data.quantity === "string" && data.quantity.trim() !== "",
    "Quantity is required and must be a non-empty string.",
    400
  );

  validateField(
    "status",
    data.status !== undefined && typeof data.status === "boolean",
    "Status must be a boolean.",
    400
  );

  // ✅ **Stap 2: Optionele velden controleren**
  validateField(
    "description",
    !data.description || typeof data.description === "string",
    "Description must be a string.",
    400
  );

  validateField(
    "category",
    !data.category || typeof data.category === "string",
    "Category must be a string.",
    400
  );

  validateField(
    "supplier",
    !data.supplier || typeof data.supplier === "string",
    "Supplier must be a string.",
    400
  );

  validateField(
    "barcode",
    !data.barcode || typeof data.barcode === "string",
    "Barcode must be a string.",
    400
  );

  validateField(
    "location",
    !data.location || typeof data.location === "string",
    "Location must be a string.",
    400
  );

  // ✅ **Stap 3: Controleer op unieke waarden (SKU en Barcode)**
  if (data.sku) {
    const existingSku = await Inventory.findOne({ sku: data.sku });
    if (existingSku) {
      errors.push({
        field: "sku",
        message: "SKU must be unique.",
        status: 409, // **Conflict (duplicate data)**
      });
    }
  }

  if (data.barcode) {
    const existingBarcode = await Inventory.findOne({ barcode: data.barcode });
    if (existingBarcode) {
      errors.push({
        field: "barcode",
        message: "Barcode must be unique.",
        status: 409, // **Conflict (duplicate data)**
      });
    }
  }

  // ✅ **Stap 4: Logging bij fouten**
  if (errors.length > 0) {
    error("[Validation] Validatiefouten gevonden", { errors });
  }

  return {
    errors,
    isValid: errors.length === 0,
  };
}