export const editInventoryItemService = async (id, data) => {
  try {
    // ✅ Haal bestaand item op
    const existingItem = await Inventory.findById(id);
    if (!existingItem) {
      return { status: 404, message: "Inventory item not found." };
    }

    // ✅ Valideer data inclusief unieke velden
    const validationResult = await validateInventoryData(data, id);
    if (!validationResult.isValid) {
      return {
        status: 400,
        message: "Validation failed.",
        errors: validationResult.errors,
      };
    }

    // ✅ Update item met Mongoose (PUT: volledige vervanging)
    const updatedItem = await Inventory.findOneAndReplace({ _id: id }, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return { status: 404, message: "Inventory item not found after update." };
    }

    // ✅ HAL JSON response
    const baseUrl = `${envConfig.serverUrl}/inventory`;

    return {
      status: 200,
      data: {
        id: updatedItem._id.toString(),
        name: updatedItem.name,
        description: updatedItem.description || null,
        quantity: updatedItem.quantity,
        category: updatedItem.category || null,
        supplier: updatedItem.supplier || null,
        location: updatedItem.location || null,
        sku: updatedItem.sku,
        barcode: updatedItem.barcode,
        status: updatedItem.status,
        _links: {
          self: { href: `${baseUrl}/${id}` },
          collection: { href: baseUrl },
        },
      },
    };
  } catch (err) {
    return {
      status: 500,
      message: "Error updating inventory item",
      error: err.message,
    };
  }
};
