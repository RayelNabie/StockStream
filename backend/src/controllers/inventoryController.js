import { Inventory } from "../models/Inventory.js";
import { info, debug, error } from "../utils/logger.js";
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

export const getAllInventory = async (req, res) => {
  info("[Controller] GET /inventory aangeroepen", { query: req.query });

  const response = await getInventoryItemsService(req.query);

  return res.status(response.status).json(response);
};

export const getInventoryDetail = async (req, res) => {
  info("[Controller] GET /inventory/:id aangeroepen", { params: req.params });

  try {
    const data = await getInventoryDetailService(req.params.id);
    return res.status(200).json(data); // ✅ **Altijd status 200 als het werkt**
  } catch (err) {
    error("[Controller] Fout bij ophalen van inventarisitem", {
      error: err.message,
    });

    // ✅ **Extract statuscode uit error message (bijv. "400|Foutbericht")**
    const [status, message] = err.message.includes("|")
      ? err.message.split("|")
      : [500, "Interne serverfout bij ophalen van inventarisitem"];

    return res.status(parseInt(status, 10)).json({ message });
  }
};

export const createNewInventoryItem = async (req, res) => {
  info("[Controller] POST /inventory aangeroepen", { requestBody: req.body });

  // ✅ **Stap 1: Genereer SKU als deze ontbreekt**
  if (!req.body.sku) {
    const skuResponse = await generateUniqueSku(req.body.category || "GENE");
    if (skuResponse.status !== 201) {
      return res
        .status(skuResponse.status)
        .json({ message: skuResponse.message });
    }
    req.body.sku = skuResponse.sku;
    info("[Controller] SKU automatisch gegenereerd", { sku: req.body.sku });
  }

  // ✅ **Stap 2: Genereer Barcode als deze ontbreekt**
  if (!req.body.barcode) {
    const barcodeResponse = await assignBarcode(req.body.warehouseNumber || 0);
    if (barcodeResponse.status !== 201) {
      return res
        .status(barcodeResponse.status)
        .json({ message: barcodeResponse.message });
    }
    req.body.barcode = barcodeResponse.barcode;
    info("[Controller] Barcode automatisch gegenereerd", {
      barcode: req.body.barcode,
    });
  }

  // ✅ **Stap 3: Zet standaard status op true als deze ontbreekt**
  req.body.status = req.body.status !== undefined ? req.body.status : true;

  // ✅ **Stap 4: Valideer de invoerdata**
  const validationResult = await validateInventoryData(req.body);
  if (!validationResult.isValid) {
    return res.status(validationResult.status).json({
      message: "Validatiefouten gedetecteerd",
      errors: validationResult.errors,
    });
  }

  // ✅ **Stap 5: Roep de servicelaag aan**
  const response = await createInventoryItem(req.body);

  // ✅ **Stap 6: Geef de statuscode en JSON-response correct door**
  return res.status(response.status).json(response);
};



export const editInventoryItem = async (req, res) => {
  const { id } = req.params;
  const inventoryData = req.body;

  console.log("🔍 [Controller] PUT-verzoek ontvangen voor ID:", id);

  // ✅ **Stap 1: Controleer of het een geldig ObjectId is vóórdat Mongoose het verwerkt**
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("❌ [Controller] Ongeldige ObjectId:", id);
    return res.status(400).json({
      httpStatus: 400,
      message: "Ongeldige ID opgegeven. Moet een geldige MongoDB ObjectId zijn.",
    });
  }

  // ✅ **Stap 2: Valideer de inputgegevens met de bestaande validatieservice**
  const validation = await validateInventoryData(inventoryData, {
    existingItemId: id,
  });

  if (!validation.isValid) {
    return res.status(validation.status).json(validation); // 🔥 **Gebruik statuscode en message van validatieservice**
  }

  // ✅ **Stap 3: Roep de service aan en stuur direct de response terug**
  const result = await editInventoryItemService(id, inventoryData);

  return res.status(result.httpStatus).json(result); // 🔥 **Service bepaalt hier de uiteindelijke statuscode**
};
// ✅ PATCH: Gedeeltelijke update van een inventarisitem
export const updateInventoryItem = async (req, res) => {
  try {
    info("[Controller] PATCH /inventory/:id aangeroepen", {
      params: req.params,
      requestBody: req.body,
    });

    const result = await updateInventoryItemService(req.params.id, req.body);

    if (result.error) {
      return res.status(result.status).json({
        message: result.error,
        details: result.details || null,
      });
    }

    return res.status(result.status).json(result.data);
  } catch (err) {
    error("[Controller] Fout bij updaten van inventarisitem", {
      error: err.message,
    });

    return res.status(500).json({
      message: "Interne serverfout bij updaten van inventarisitem",
      error: err.message,
    });
  }
};

// ✅ DELETE: Inventarisitem verwijderen via ID
export const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    info("[Controller] DELETE /inventory/:id aangeroepen", { id });

    // ✅ **Stap 1: Roep de service aan**
    const response = await deleteInventoryItemService(id);

    // ✅ **Stap 2: Geef de juiste statuscode terug**
    if (response.status === 204) {
      return res.status(204).end(); // Geen inhoud bij succesvolle verwijdering
    }

    return res.status(response.status).json({
      message: response.message,
    });
  } catch (err) {
    error("[Controller] Fout bij verwijderen van inventarisitem", {
      error: err.message,
    });

    return res.status(500).json({
      message: "Interne serverfout bij verwijderen van inventarisitem",
      error: err.message,
    });
  }
};
