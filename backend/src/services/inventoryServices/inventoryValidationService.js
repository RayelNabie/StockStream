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
      (typeof data.lowStockThreshold === "number" && data.lowStockThreshold >= 0),
    "Low stock threshold must be a non-negative number."
  );

  validateField(
    "location",
    !data.location || typeof data.location === "string",
    "Location must be a string."
  );

  return {
    errors,
    isValid: errors.length === 0,
  };
}