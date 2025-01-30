import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";
import { validateInventoryData } from "./inventoryValidationService.js";
import { info, error } from "../../utils/logger.js";

export const updateInventoryItemService = async (id, data) => {
  try {
    // ✅ **Stap 1: Controleer of ID geldig is**
    if (!id || typeof id !== "string" || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return { status: 400, error: "Ongeldige ID. Zorg ervoor dat het een geldige ObjectId is." };
    }

    // ✅ **Stap 2: Haal bestaand item op**
    const existingItem = await Inventory.findById(id);
    if (!existingItem) {
      return { status: 404, error: `Inventarisitem met ID ${id} niet gevonden.` };
    }

    // ✅ **Stap 3: Filter ongeldige of lege waarden (PATCH: alleen gewijzigde velden)**
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined && value !== "")
    );

    if (Object.keys(updateData).length === 0) {
      return { status: 400, error: "Geen geldige velden om te updaten." };
    }

    // ✅ **Stap 4: Valideer data, waarbij SKU en Barcode niet uniek hoeven te zijn bij PATCH**
    const validationResult = await validateInventoryData(updateData, { existingItemId: id, isPatch: true });
    if (!validationResult.isValid) {
      return { status: 400, error: "Validatiefouten gedetecteerd.", details: validationResult.errors };
    }

    // ✅ **Stap 5: Controleer of er daadwerkelijk iets is veranderd (typecasting fix)**
    const isSameData = Object.keys(updateData).every(
      (key) => String(existingItem[key]) === String(updateData[key])
    );
    if (isSameData) {
      return { status: 200, data: { message: "Geen wijzigingen aangebracht." } };
    }

    // ✅ **Stap 6: Update uitvoeren met Mongoose**
    const updatedItem = await Inventory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return { status: 500, error: "Fout bij updaten van het inventarisitem." };
    }

    // ✅ **Stap 7: HAL JSON-response genereren**
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