import { Inventory } from "../../models/Inventory.js";
import { info, error } from "../../utils/logger.js";
import { envConfig } from "../../config/env.js";
import { validateInventoryData } from "./inventoryValidationService.js";

export const createInventoryItem = async (data) => {
  try {
    // ✅ **Stap 1: Valideer de invoerdata**
    const validationResult = await validateInventoryData(data);
    if (!validationResult.isValid) {
      error("[Service] Validatiefouten aangetroffen", {
        errors: validationResult.errors,
      });

      return {
        status: 400,
        message: "Validatiefouten gedetecteerd",
        errors: validationResult.errors,
      };
    }

    // ✅ **Stap 2: Controleer of de SKU of Barcode al bestaat**
    const existingItem = await Inventory.findOne({
      $or: [{ sku: data.sku }, { barcode: data.barcode }],
    });

    if (existingItem) {
      error("[Service] SKU of Barcode moet uniek zijn", {
        sku: data.sku,
        barcode: data.barcode,
      });

      return {
        status: 409, // Conflict
        message: "SKU of Barcode moet uniek zijn",
      };
    }

    // ✅ **Stap 3: Maak een nieuw inventarisitem**
    const newItem = new Inventory(data);
    const savedItem = await newItem.save(); // Correct opslaan in MongoDB

    // ✅ **Stap 4: Log de succesvolle aanmaak**
    info("[Service] Inventarisitem succesvol aangemaakt", {
      itemId: savedItem._id,
    });

    // ✅ **Stap 5: Bepaal de base URL voor HATEOAS links**
    const baseUrl = `${envConfig.serverUrl}/inventory`;

    // ✅ **Stap 6: Return JSON in HAL-format**
    return {
      status: 201, // Created
      item: {
        id: savedItem._id.toString(), // Zorgt dat `_id` een string is
        name: savedItem.name,
        description: savedItem.description,
        sku: savedItem.sku,
        quantity: savedItem.quantity,
        category: savedItem.category,
        supplier: savedItem.supplier,
        status: savedItem.status,
        barcode: savedItem.barcode,
        location: savedItem.location,
        createdAt: savedItem.createdAt,
        updatedAt: savedItem.updatedAt,
        _links: {
          self: { href: `${baseUrl}/${savedItem._id}` },
          collection: { href: baseUrl },
        },
      },
    };
  } catch (err) {
    // ✅ **Foutafhandeling**
    error("[Service] Fout bij aanmaken van inventarisitem", {
      error: err.message,
    });

    return {
      status: 500,
      message: "Interne serverfout bij aanmaken van inventarisitem",
      error: err.message,
    };
  }
};