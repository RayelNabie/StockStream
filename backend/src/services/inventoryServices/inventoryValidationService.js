import { Inventory } from "../../models/Inventory.js";

/**
 * ✅ Valideert inventarisdata voor POST, PUT of PATCH
 * @param {Object} data - De ingevoerde data
 * @param {Object} options - { existingItemId: string|null, isPatch: boolean }
 * @returns {Object} - { errors: Array, isValid: boolean, status: number }
 */
export async function validateInventoryData(data, { existingItemId = null, isPatch = false } = {}) {
  const errors = [];
  let conflict = false; // **Bepaalt of er een 409 (Conflict) moet komen**

  // ✅ **Helperfunctie voor validatie**
  const validateField = (field, condition, errorMessage) => {
    if (!condition) errors.push({ field, message: errorMessage });
  };

  // ✅ **Vereiste velden voor POST/PUT (volledige vervangingen)**
  if (!isPatch) {
    validateField("name", typeof data.name === "string" && data.name.trim() !== "", "Name is required.");
    validateField("sku", typeof data.sku === "string" && data.sku.trim() !== "", "SKU is required.");
    validateField("quantity", typeof data.quantity === "string" && data.quantity.trim() !== "", "Quantity is required.");
  }

  // ✅ **Status moet een echte boolean zijn**
  if (data.status !== undefined) {
    validateField("status", typeof data.status === "boolean", "Status must be a boolean.");
  }

  // ✅ **Optionele velden controleren**
  validateField("description", data.description === undefined || typeof data.description === "string", "Description must be a string.");
  validateField("category", data.category === undefined || typeof data.category === "string", "Category must be a string.");
  validateField("supplier", data.supplier === undefined || typeof data.supplier === "string", "Supplier must be a string.");
  validateField("barcode", data.barcode === undefined || typeof data.barcode === "string", "Barcode must be a string.");
  validateField("location", data.location === undefined || typeof data.location === "string", "Location must be a string.");

  // ✅ **Controleer uniekheid van Name, SKU & Barcode alleen als ze worden gewijzigd**
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

  return {
    errors,
    isValid: errors.length === 0,
    status: conflict ? 409 : errors.length > 0 ? 400 : 200, // **409 voor conflicts, 400 voor andere validatiefouten**
  };
}