import { Inventory } from "../models/Inventory.js";
import {
  createInventoryItem,
  validateInventoryData,
  assignBarcode,
  generateUniqueSku,
  editInventoryItemService,
  updateInventoryItemService,
  getInventoryDetailService,
  getInventoryItemsService,
  deleteInventoryItemService,
} from "../services/inventoryServices/inventoryService.js";
import mongoose from "mongoose";
import { info, debug, error } from "../utils/logger.js";

export const getAllInventory = async (req, res) => {
  debug("[Controller] GET /inventory aangeroepen", { query: req.query });

  const response = await getInventoryItemsService(req.query);
  return res.status(response.status).json(response);
};

export const getInventoryDetail = async (req, res) => {
  debug("[Controller] GET /inventory/:id aangeroepen", { params: req.params });

  try {
    const data = await getInventoryDetailService(req.params.id);
    return res.status(200).json(data);
  } catch (err) {
    error("[Controller] Fout bij ophalen van inventarisitem", {
      error: err.message,
    });

    const [status, message] = err.message.includes("|")
      ? err.message.split("|")
      : [500, "Interne serverfout bij ophalen van inventarisitem"];

    return res.status(parseInt(status, 10)).json({ message });
  }
};

export const createNewInventoryItem = async (req, res) => {
  debug("[Controller] POST /inventory aangeroepen", { requestBody: req.body });

  try {
    if (!req.body.sku) {
      debug("[Controller] SKU ontbreekt, genereren...");
      const skuResponse = await generateUniqueSku(req.body.category || "GENE");
      if (skuResponse.status !== 201) {
        error("[Controller] SKU genereren mislukt", {
          message: skuResponse.message,
        });
        return res
          .status(skuResponse.status)
          .json({ message: skuResponse.message });
      }
      req.body.sku = skuResponse.sku;
    }

    if (!req.body.barcode) {
      debug("[Controller] Barcode ontbreekt, genereren...");
      const barcodeResponse = await assignBarcode(
        req.body.warehouseNumber || 0
      );
      if (barcodeResponse.status !== 201) {
        error("[Controller] Barcode genereren mislukt", {
          message: barcodeResponse.message,
        });
        return res
          .status(barcodeResponse.status)
          .json({ message: barcodeResponse.message });
      }
      req.body.barcode = barcodeResponse.barcode;
    }

    if (typeof req.body.status === "string") {
      req.body.status = req.body.status === "1";
      debug("[Controller] Status geconverteerd naar boolean", {
        status: req.body.status,
      });
    } else {
      req.body.status = req.body.status !== undefined ? req.body.status : true;
    }

    const validationResult = await validateInventoryData(req.body);
    if (!validationResult.isValid) {
      error("[Controller] Validatiefouten gedetecteerd", {
        errors: validationResult.errors,
      });
      return res.status(validationResult.status).json({
        message: "Validatiefouten gedetecteerd",
        errors: validationResult.errors,
      });
    }

    debug("[Controller] Data gevalideerd, doorgaan met aanmaken...");
    const response = await createInventoryItem(req.body);
    return res.status(response.status).json(response);
  } catch (err) {
    error("[Controller] Fout bij aanmaken van inventarisitem", {
      error: err.message,
    });

    return res.status(500).json({
      message: "Interne serverfout bij aanmaken van inventarisitem.",
      error: err.message,
    });
  }
};

export const editInventoryItem = async (req, res) => {
  debug("[Controller] PUT /inventory/:id aangeroepen", {
    id: req.params.id,
    requestBody: req.body,
  });

  const { id } = req.params;
  let inventoryData = { ...req.body };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    error("[Controller] Ongeldige ObjectId ontvangen", { id });
    return res.status(400).json({
      httpStatus: 400,
      message:
        "Ongeldige ID opgegeven. Moet een geldige MongoDB ObjectId zijn.",
    });
  }

  delete inventoryData.id;
  delete inventoryData.createdAt;
  delete inventoryData._links;
  inventoryData.updatedAt = new Date().toISOString();

  if (typeof inventoryData.status === "string") {
    inventoryData.status = inventoryData.status === "1";
  }

  if (!inventoryData.sku) {
    debug("[Controller] SKU ontbreekt, genereren...");
    const skuResponse = await generateUniqueSku(
      inventoryData.category || "GENE"
    );
    if (skuResponse.status !== 201) {
      error("[Controller] SKU genereren mislukt", {
        message: skuResponse.message,
      });
      return res
        .status(skuResponse.status)
        .json({ message: skuResponse.message });
    }
    inventoryData.sku = skuResponse.sku;
  }

  if (!inventoryData.barcode) {
    debug("[Controller] Barcode ontbreekt, genereren...");
    const barcodeResponse = await assignBarcode(
      inventoryData.warehouseNumber || 0
    );
    if (barcodeResponse.status !== 201) {
      error("[Controller] Barcode genereren mislukt", {
        message: barcodeResponse.message,
      });
      return res
        .status(barcodeResponse.status)
        .json({ message: barcodeResponse.message });
    }
    inventoryData.barcode = barcodeResponse.barcode;
  }

  const validation = await validateInventoryData(inventoryData, {
    existingItemId: id,
  });

  if (!validation.isValid) {
    error("[Controller] Validatiefouten gedetecteerd", {
      errors: validation.errors,
    });
    return res.status(validation.status).json(validation);
  }

  debug("[Controller] Data gevalideerd, doorgaan met bewerken...");
  const result = await editInventoryItemService(id, inventoryData);
  return res.status(result.httpStatus).json(result);
};

export const updateInventoryItem = async (req, res) => {
  debug("[Controller] PATCH /inventory/:id aangeroepen", {
    params: req.params,
    requestBody: req.body,
  });

  try {
    const result = await updateInventoryItemService(req.params.id, req.body);

    if (result.error) {
      error("[Controller] Fout bij updaten", { message: result.error });
      return res.status(result.status).json({
        message: result.error,
        details: result.details || null,
      });
    }

    return res.status(result.status).json(result.data);
  } catch (err) {
    error("[Controller] Interne serverfout bij updaten", {
      error: err.message,
    });

    return res.status(500).json({
      message: "Interne serverfout bij updaten van inventarisitem",
      error: err.message,
    });
  }
};

export const deleteInventoryItem = async (req, res) => {
  debug("[Controller] DELETE /inventory/:id aangeroepen", {
    id: req.params.id,
  });

  try {
    const { id } = req.params;
    const response = await deleteInventoryItemService(id);

    if (response.status === 204) {
      debug("[Controller] Inventarisitem succesvol verwijderd", { id });
      return res.status(204).end();
    }

    return res.status(response.status).json({
      message: response.message,
    });
  } catch (err) {
    error("[Controller] Interne serverfout bij verwijderen", {
      error: err.message,
    });

    return res.status(500).json({
      message: "Interne serverfout bij verwijderen van inventarisitem",
      error: err.message,
    });
  }
};
