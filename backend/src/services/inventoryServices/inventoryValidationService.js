import { Inventory } from "../../models/Inventory.js";

export async function validateInventoryData(data, { existingItemId = null, isPatch = false } = {}) {
  const errors = [];

  // ✅ **Helperfunctie voor validatie**
  const validateField = (field, condition, errorMessage) => {
    if (!condition) errors.push({ field, message: errorMessage });
  };

  // ✅ **Vereiste velden voor PUT/POST**
  if (!isPatch) {
    validateField(
      "name",
      typeof data.name === "string" && data.name.trim() !== "",
      "Name is required and must be a non-empty string."
    );

    validateField(
      "sku",
      typeof data.sku === "string" && data.sku.trim() !== "",
      "SKU is required and must be a non-empty string."
    );

    validateField(
      "quantity",
      typeof data.quantity === "string" && data.quantity.trim() !== "",
      "Quantity is required and must be a non-empty string."
    );
  }

  // ✅ **Status moet een echte boolean zijn (voor zowel PUT als PATCH)**
  if (data.status !== undefined) {
    validateField(
      "status",
      typeof data.status === "boolean",
      "Status must be a boolean (true or false)."
    );
  }

  // ✅ **Optionele velden controleren**
  validateField(
    "description",
    data.description === undefined || typeof data.description === "string",
    "Description must be a string."
  );

  validateField(
    "category",
    data.category === undefined || typeof data.category === "string",
    "Category must be a string."
  );

  validateField(
    "supplier",
    data.supplier === undefined || typeof data.supplier === "string",
    "Supplier must be a string."
  );

  validateField(
    "barcode",
    data.barcode === undefined || typeof data.barcode === "string",
    "Barcode must be a string."
  );

  validateField(
    "location",
    data.location === undefined || typeof data.location === "string",
    "Location must be a string."
  );

  // ✅ **Controleer uniekheid van SKU & Barcode alleen als ze worden gewijzigd**
  if (!isPatch || (isPatch && data.sku !== undefined)) {
    const skuExists = await Inventory.exists({
      sku: data.sku,
      _id: { $ne: existingItemId },
    });

    if (skuExists) {
      errors.push({ field: "sku", message: "SKU must be unique." });
    }
  }

  if (!isPatch || (isPatch && data.barcode !== undefined)) {
    const barcodeExists = await Inventory.exists({
      barcode: data.barcode,
      _id: { $ne: existingItemId },
    });

    if (barcodeExists) {
      errors.push({ field: "barcode", message: "Barcode must be unique." });
    }
  }

  return {
    errors,
    isValid: errors.length === 0,
  };
}