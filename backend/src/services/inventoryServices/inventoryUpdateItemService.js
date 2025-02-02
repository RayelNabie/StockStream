import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";
import { validateInventoryData } from "./inventoryValidationService.js";
import { info, error, debug } from "../../utils/logger.js";

export const updateInventoryItemService = async (id, data) => {
  try {
    debug("[Service] Start update van inventarisitem", { id, data });

    if (!id || typeof id !== "string" || !id.match(/^[0-9a-fA-F]{24}$/)) {
      error("[Service] Ongeldige ObjectId ontvangen", { id });
      return { status: 400, error: "Ongeldige ID. Zorg ervoor dat het een geldige ObjectId is." };
    }

    const existingItem = await Inventory.findById(id);
    if (!existingItem) {
      info("[Service] Inventarisitem niet gevonden", { id });
      return { status: 404, error: `Inventarisitem met ID ${id} niet gevonden.` };
    }

    debug("[Service] Bestaand item gevonden", { existingItem });

    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined && value !== "")
    );

    if (Object.keys(updateData).length === 0) {
      info("[Service] Geen geldige velden om te updaten", { id });
      return { status: 400, error: "Geen geldige velden om te updaten." };
    }

    debug("[Service] Gevalideerde update-data", { updateData });

    const validationResult = await validateInventoryData(updateData, { existingItemId: id, isPatch: true });
    if (!validationResult.isValid) {
      error("[Service] Validatiefouten gedetecteerd", { validationErrors: validationResult.errors });
      return { status: 400, error: "Validatiefouten gedetecteerd.", details: validationResult.errors };
    }

    const isSameData = Object.keys(updateData).every(
      (key) => String(existingItem[key]) === String(updateData[key])
    );

    if (isSameData) {
      info("[Service] Geen wijzigingen aangebracht", { id });
      return { status: 200, data: { message: "Geen wijzigingen aangebracht." } };
    }

    debug("[Service] Uitvoeren van update in database", { id, updateData });

    const updatedItem = await Inventory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      error("[Service] Fout bij updaten van het inventarisitem", { id });
      return { status: 500, error: "Fout bij updaten van het inventarisitem." };
    }

    const baseUrl = `${envConfig.serverUrl}/inventory`;

    const response = {
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
      createdAt: updatedItem.createdAt.toISOString(),
      updatedAt: updatedItem.updatedAt.toISOString(),
      _links: {
        self: { href: `${baseUrl}/${id}` },
        collection: { href: baseUrl },
      },
    };

    info("[Service] Inventarisitem succesvol bijgewerkt", { id });

    return { status: 200, data: response };
  } catch (err) {
    error("[Service] Fout bij updaten van inventarisitem", { error: err.message });

    return { status: 500, error: "Interne serverfout bij updaten van inventarisitem.", details: err.message };
  }
};