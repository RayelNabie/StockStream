import { Inventory } from "../../models/Inventory.js";
import { info, debug, error } from "../../utils/logger.js";
import { envConfig } from "../../config/env.js";

export const createInventoryItem = async (data) => {
  try {
    debug("[Service] Start proces: nieuw inventarisitem aanmaken", { data });

    const existingItem = await Inventory.findOne({
      $or: [{ sku: data.sku }, { barcode: data.barcode }],
    });

    if (existingItem) {
      error("[Service] SKU of Barcode bestaat al", {
        sku: data.sku,
        barcode: data.barcode,
      });

      return {
        status: 409,
        message: "SKU of Barcode moet uniek zijn",
      };
    }

    const newItem = new Inventory(data);
    const savedItem = await newItem.save();

    info("[Service] Inventarisitem succesvol aangemaakt", {
      itemId: savedItem._id.toString(),
      name: savedItem.name,
      sku: savedItem.sku,
      barcode: savedItem.barcode,
    });

    const baseUrl = `${envConfig.serverUrl}/inventory`;

    return {
      status: 201,
      item: {
        id: savedItem._id.toString(),
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
    error("[Service] Fout bij aanmaken van inventarisitem", { error: err.message });

    return {
      status: 500,
      message: "Interne serverfout bij aanmaken van inventarisitem",
      error: err.message,
    };
  }
};