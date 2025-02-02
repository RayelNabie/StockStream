import mongoose from "mongoose";
import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";
import { info, debug, error } from "../../utils/logger.js";

export const editInventoryItemService = async (id, data) => {
  debug("[Service] Start updateproces voor inventarisitem", { id, data });

  if (!mongoose.Types.ObjectId.isValid(id)) {
    info("[Service] Ongeldige ObjectId ontvangen", { id });
    return { httpStatus: 400, message: "Ongeldige ID opgegeven. Moet een geldige MongoDB ObjectId zijn." };
  }

  const existingItem = await Inventory.findById(id).lean();
  if (!existingItem) {
    info("[Service] Inventarisitem niet gevonden", { id });
    return { httpStatus: 404, message: "Inventarisitem niet gevonden." };
  }

  debug("[Service] Bestaand item gevonden, verwerken update...", { existingItem });

  delete data.id;
  delete data._id;
  delete data.createdAt;
  delete data.updatedAt;

  const newItem = {
    _id: existingItem._id,
    name: data.name || null,
    description: data.description || null,
    quantity: data.quantity || null,
    category: data.category || null,
    supplier: data.supplier || null,
    location: data.location || null,
    sku: data.sku || null,
    barcode: data.barcode || null,
    status: data.status !== undefined ? data.status : true,
  };

  debug("[Service] Data die naar MongoDB wordt gestuurd", { newItem });

  try {
    const replacedItem = await Inventory.findOneAndReplace(
      { _id: id },
      newItem,
      { new: true, runValidators: true }
    );

    if (!replacedItem) {
      error("[Service] Fout bij vervangen van inventarisitem", { id });
      return { httpStatus: 500, message: "Fout bij vervangen van inventarisitem." };
    }

    info("[Service] Inventarisitem succesvol geüpdatet", { id: replacedItem._id });

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
    if (err.name === "ValidationError") {
      error("[Service] Validatiefout in de database", { errors: err.errors });
      return {
        httpStatus: 400,
        message: "Validatiefout in de database",
        errors: Object.values(err.errors).map((e) => e.message),
      };
    }

    error("[Service] Onverwachte fout bij vervangen van inventarisitem", { error: err.message });

    return {
      httpStatus: 500,
      message: "Interne serverfout bij vervangen van inventarisitem.",
      error: err.message,
    };
  }
};