import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";
import { validateInventoryData } from "./inventoryValidationService.js";
import { info, error } from "../../utils/logger.js";

export const updateInventoryItemService = async (id, data) => {
  try {
    // ✅ **Stap 1: Controleer of ID is meegegeven**
    if (!id || typeof id !== "string") {
      return {
        error: "ID is vereist en moet een geldige string zijn.",
        status: 400,
      };
    }

    // ✅ **Stap 2: Filter ongeldige of lege waarden**
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined && value !== "")
    );

    if (Object.keys(updateData).length === 0) {
      return {
        error: "Lege update niet toegestaan. Gebruik PUT voor volledige vervangingen.",
        status: 400,
      };
    }

    // ✅ **Stap 3: Controleer of item bestaat vóór update**
    const existingItem = await Inventory.findById(id);
    if (!existingItem) {
      return {
        error: `Inventory item met ID ${id} niet gevonden.`,
        status: 404,
      };
    }

    // ✅ **Stap 4: Valideer de ingevoerde data**
    const validationResult = await validateInventoryData(updateData);
    if (!validationResult.isValid) {
      return {
        error: "Validatiefouten gedetecteerd.",
        status: 400,
        details: validationResult.errors,
      };
    }

    // ✅ **Stap 5: Voer update uit**
    const updatedItem = await Inventory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return {
        error: "Fout bij updaten van het inventarisitem.",
        status: 500,
      };
    }

    // ✅ **Stap 6: HAL+JSON response genereren**
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

    return { data: response, status: 200 };
  } catch (err) {
    error("[Service] Fout bij updaten van inventarisitem", { error: err.message });

    return {
      error: "Interne serverfout bij updaten van inventarisitem.",
      status: 500,
    };
  }
};