import mongoose from "mongoose";
import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";
import { info, error } from "../../utils/logger.js";

export const editInventoryItemService = async (id, data) => {
  info(`🔍 [Service] PUT-update wordt uitgevoerd voor ID: ${id}`);
  info(`📌 Ontvangen JSON-body: ${JSON.stringify(data, null, 2)}`);

  // ✅ **Stap 1: Controleer of het een geldig MongoDB ObjectId is met Mongoose**
  if (!mongoose.Types.ObjectId.isValid(id)) {
    error(`❌ [Service] Ongeldige ID opgegeven: ${id}`);
    return { httpStatus: 400, message: "Ongeldige ID opgegeven. Moet een geldige MongoDB ObjectId zijn." };
  }

  // ✅ **Stap 2: Haal bestaand item op**
  const existingItem = await Inventory.findById(id).lean();
  if (!existingItem) {
    error(`❌ [Service] Inventarisitem niet gevonden voor ID: ${id}`);
    return { httpStatus: 404, message: "Inventarisitem niet gevonden." };
  }

  info(`✅ [Service] Bestaand item gevonden: ${JSON.stringify(existingItem, null, 2)}`);

  // ✅ **Stap 3: Verwijder `id` en `_id` uit `data`, zodat ze niet per ongeluk worden gewijzigd**
  delete data.id;
  delete data._id;
  delete data.createdAt;
  delete data.updatedAt;

  // ✅ **Stap 4: Zet `status` standaard op `true` als deze niet is meegegeven**
  const newItem = {
    _id: existingItem._id, // Behoud de originele ID
    name: data.name || null,
    description: data.description || null,
    quantity: data.quantity || null,
    category: data.category || null,
    supplier: data.supplier || null,
    location: data.location || null,
    sku: data.sku || null,
    barcode: data.barcode || null,
    status: data.status !== undefined ? data.status : true, // ✅ **Fix: Zet standaard op `true`**
  };

  info(`📌 [Service] Data die naar MongoDB wordt gestuurd: ${JSON.stringify(newItem, null, 2)}`);

  try {
    // ✅ **Stap 5: Voer een volledige vervangende update uit**
    const replacedItem = await Inventory.findOneAndReplace(
      { _id: id }, // Zoek het bestaande document op
      newItem, // **Volledige vervanging MET `_id` behouden**
      { new: true, runValidators: true }
    );

    if (!replacedItem) {
      error(`⚠️ [Service] Geen item gevonden om te vervangen voor ID: ${id}`);
      return { httpStatus: 500, message: "Fout bij vervangen van inventarisitem." };
    }

    info(`✅ [Service] Item succesvol vervangen: ${JSON.stringify(replacedItem, null, 2)}`);

    // ✅ **Stap 6: HAL JSON response genereren**
    const baseUrl = `${envConfig.serverUrl}/inventory`;

    return {
      httpStatus: 200,
      id: replacedItem._id.toString(),
      name: replacedItem.name,
      description: replacedItem.description,
      quantity: replacedItem.quantity,
      category: replacedItem.category,
      supplier: replacedItem.supplier,
      location: replacedItem.location,
      sku: replacedItem.sku,
      barcode: replacedItem.barcode,
      status: replacedItem.status,
      _links: {
        self: { href: `${baseUrl}/${id}` },
        collection: { href: baseUrl },
      },
    };
  } catch (err) {
    // ✅ **Afhandelen van Mongoose-fouten**
    if (err.name === "ValidationError") {
      error(`❌ [Service] Validatiefout in de database: ${JSON.stringify(err.errors, null, 2)}`);
      return {
        httpStatus: 400,
        message: "Validatiefout in de database",
        errors: Object.values(err.errors).map((e) => e.message),
      };
    }

    error(`❌ [Service] Fout bij vervangen van inventarisitem: ${err.message}`, { error: err });

    return {
      httpStatus: 500,
      message: "Interne serverfout bij vervangen van inventarisitem.",
      error: err.message,
    };
  }
};