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

export const getAllInventory = async (req, res) => {
  try {
    const response = await getInventoryItemsService(req.query);

    // Stuur de HAL JSON-structuur zoals die uit de service komt direct terug
    return res.status(200).json(response);
  } catch (err) {
    error("[Controller] Fout bij ophalen van inventaris", {
      error: err.message,
    });

    return res.status(400).json({
      message: "Fout bij ophalen van inventaris",
      error: err.message,
    });
  }
};

// ✅ GET: Een enkel inventarisitem ophalen via ID
export const getInventoryDetail = async (req, res) => {
  try {
    info("[Controller] GET /inventory/:id aangeroepen", { params: req.params });

    const response = await getInventoryDetailService(req.params.id);

    // ✅ **Geef de juiste statuscode terug**
    return res.status(response.status).json(response);
  } catch (err) {
    error("[Controller] Fout bij ophalen van inventarisitem", {
      error: err.message,
    });

    return res.status(500).json({
      message: "Interne serverfout bij ophalen van inventarisitem",
      error: err.message,
    });
  }
};

// ✅ POST: Nieuw inventarisitem aanmaken
export const createNewInventoryItem = async (req, res) => {
  try {
    if (!req.body.sku) {
      req.body.sku = await generateUniqueSku(req.body.category || "GENE");
      info("[Service] SKU automatisch gegenereerd", { sku: req.body.sku });
    }

    if (!req.body.barcode) {
      req.body.barcode = await assignBarcode(req.body.warehouseNumber || 0);
      info("[Service] Barcode automatisch gegenereerd", {
        barcode: req.body.barcode,
      });
    }

    req.body.status = req.body.status !== undefined ? req.body.status : true;
    info("[Service] Status toegewezen", { status: req.body.status });

    const validationResult = await validateInventoryData(req.body);
    if (!validationResult.isValid) {
      return res.status(400).json({
        message: "Validatiefouten gedetecteerd",
        errors: validationResult.errors,
      });
    }

    const newItem = await createInventoryItem(req.body);
    info("[Service] Inventarisitem succesvol aangemaakt", { newItem });

    return res.status(201).json({
      message: "Inventarisitem succesvol aangemaakt",
      item: newItem,
    });
  } catch (err) {
    error("[Controller] Fout bij aanmaken van inventarisitem", {
      error: err.message,
    });

    return res.status(500).json({
      message: "Interne serverfout bij aanmaken van inventarisitem",
      error: err.message,
    });
  }
};

// ✅ PUT: Volledig inventarisitem vervangen (vereist alle velden)
export const editInventoryItem = async (req, res) => {
  try {
    info("[Controller] PUT /inventory/:id aangeroepen", {
      params: req.params,
      requestBody: req.body,
    });

    const result = await editInventoryItemService(req.params.id, req.body);

    if (result.error) {
      return res.status(result.status).json({
        message: result.error,
        details: result.details || null,
      });
    }

    return res.status(200).json(result.data);
  } catch (err) {
    error("[Controller] Fout bij bijwerken van inventarisitem", {
      error: err.message,
    });

    return res.status(500).json({
      message: "Interne serverfout bij bijwerken van inventarisitem",
      error: err.message,
    });
  }
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
