import { Inventory } from "../../models/Inventory.js";
import { info, error, debug } from "../../utils/logger.js";

export async function validateInventoryData(data, { existingItemId = null, isPatch = false } = {}) {
  debug("[Service] Start validatie van inventarisdata", { data, existingItemId, isPatch });

  const errors = [];
  let conflict = false;

  const validateField = (field, condition, errorMessage) => {
    if (!condition) errors.push({ field, message: errorMessage });
  };

  if (!isPatch) {
    validateField("name", typeof data.name === "string" && data.name.trim() !== "", "Name is required.");
    validateField("sku", typeof data.sku === "string" && data.sku.trim() !== "", "SKU is required.");
    validateField("quantity", typeof data.quantity === "string" && data.quantity.trim() !== "", "Quantity is required.");
  }

  if (data.status !== undefined) {
    validateField("status", typeof data.status === "boolean", "Status must be a boolean.");
  }

  validateField("description", data.description === undefined || typeof data.description === "string", "Description must be a string.");
  validateField("category", data.category === undefined || typeof data.category === "string", "Category must be a string.");
  validateField("supplier", data.supplier === undefined || typeof data.supplier === "string", "Supplier must be a string.");
  validateField("barcode", data.barcode === undefined || typeof data.barcode === "string", "Barcode must be a string.");
  validateField("location", data.location === undefined || typeof data.location === "string", "Location must be a string.");

  if (!isPatch || (isPatch && data.name !== undefined)) {
    const nameExists = await Inventory.exists({ name: data.name, _id: { $ne: existingItemId } });
    if (nameExists) {
      errors.push({ field: "name", message: "Name must be unique." });
      conflict = true;
    }
  }

  if (!isPatch || (isPatch && data.sku !== undefined)) {
    const skuExists = await Inventory.exists({ sku: data.sku, _id: { $ne: existingItemId } });
    if (skuExists) {
      errors.push({ field: "sku", message: "SKU must be unique." });
      conflict = true;
    }
  }

  if (!isPatch || (isPatch && data.barcode !== undefined)) {
    const barcodeExists = await Inventory.exists({ barcode: data.barcode, _id: { $ne: existingItemId } });
    if (barcodeExists) {
      errors.push({ field: "barcode", message: "Barcode must be unique." });
      conflict = true;
    }
  }

  if (errors.length > 0) {
    error("[Service] Validatiefouten gedetecteerd", { errors });
  } else {
    info("[Service] Validatie geslaagd");
  }

  return {
    errors,
    isValid: errors.length === 0,
    status: conflict ? 409 : errors.length > 0 ? 400 : 200,
  };
}