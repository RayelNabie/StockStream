import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";
import { validateInventoryData } from "./inventoryValidationService.js";
import { info, error } from "../../utils/logger.js";

export const editInventoryItemService = async (id, data) => {
  try {
    if (!id) {
      throw new Error("ID is vereist voor update.");
    }

    // **Filter lege en ongedefinieerde waarden eruit**
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined && value !== "")
    );

    if (Object.keys(updateData).length === 0) {
      throw new Error("Lege update niet toegestaan. Gebruik PATCH voor gedeeltelijke updates.");
    }

    // **Voer validatie uit vóór de update**
    const validationResult = await validateInventoryData(updateData);
    if (!validationResult.isValid) {
      throw new Error(`Validatiefouten: ${JSON.stringify(validationResult.errors)}`);
    }

    // **PUT betekent volledige vervanging → gebruik `findOneAndReplace`**
    const updatedItem = await Inventory.findOneAndReplace(
      { _id: id },
      updateData,
      { new: true, runValidators: true }
    );

    // **Check of item daadwerkelijk is geüpdatet**
    if (!updatedItem) {
      throw new Error(`Inventory item met ID ${id} niet gevonden.`);
    }

    // **HAL JSON response genereren**
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
      _links: {
        self: { href: `${baseUrl}/${id}` },
        collection: { href: baseUrl },
      },
    };

    // **Logging voor succesvolle update**
    info("[Service] Inventarisitem succesvol geüpdatet", { id });

    return response;
  } catch (err) {
    // **Logging voor fouten**
    error("[Service] Fout bij updaten van inventarisitem", { error: err.message });

    throw new Error(`Fout bij update: ${err.message}`);
  }
};