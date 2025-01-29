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
} from "../services/inventoryServices/inventoryService.js";

export const getAllInventory = async (req, res) => {
  try {
    const { items, pagination } = await getInventoryItemsService(req.query);
    return res.status(200).json({
      items,
      pagination,
    });
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

export const getInventoryDetail = async (req, res) => {
  try {
    info("[Controller] GET /inventory/:id aangeroepen", { params: req.params });
    const response = await getInventoryDetailService(req.params.id);
    return res.status(200).json(response);
  } catch (err) {
    error("[Controller] Fout bij ophalen van inventarisitem", {
      error: err.message,
    });
    return res.status(500).json({
      message: "Fout bij ophalen van inventarisitem",
      error: err.message,
    });
  }
};

export const createNewInventoryItem = async (req, res) => {
  try {
    // Genereer SKU als deze niet is opgegeven
    if (!req.body.sku) {
      req.body.sku = await generateUniqueSku(req.body.category || "GENE");
      info("[Service] SKU automatisch gegenereerd", { sku: req.body.sku });
    }

    // Genereer Barcode als deze niet is opgegeven
    if (!req.body.barcode) {
      req.body.barcode = await assignBarcode(req.body.warehouseNumber || 0);
      info("[Service] Barcode automatisch gegenereerd", {
        barcode: req.body.barcode,
      });
    }

    // Verwerk en stel standaard status in
    req.body.status = req.body.status !== undefined ? req.body.status : true;
    info("[Service] Status toegewezen", { status: req.body.status });

    // Valideer de ingevoerde data
    const validationResult = await validateInventoryData(req.body);
    if (!validationResult.isValid) {
      info("[Service] Validatiefouten aangetroffen", {
        errors: validationResult.errors,
      });
      return res.status(400).json({
        message: "Validatiefouten gedetecteerd",
        errors: validationResult.errors,
      });
    }

    // Maak het nieuwe item aan
    const newItem = await createInventoryItem(req.body);
    info("[Service] Inventarisitem succesvol aangemaakt", { newItem });

    // Stuur de succesvolle respons terug
    return res.status(201).json({
      message: "Inventarisitem succesvol aangemaakt",
      item: newItem,
    });
  } catch (err) {
    // Log en stuur fout terug bij een error
    error("[Service] Fout bij aanmaken van inventarisitem", {
      error: err.message,
    });
    return res.status(500).json({
      message: "Kan inventaris niet toevoegen",
      error: err.message,
    });
  }
};

export const editInventoryItem = async (req, res) => {
  try {
    info("[Controller] PUT /inventory/:id aangeroepen", {
      params: req.params,
      requestBody: req.body,
    });

    const updatedItem = await editInventoryItemService(req.params.id, req.body);

    info("[Controller] Inventarisitem succesvol bijgewerkt", {
      id: updatedItem._id,
      name: updatedItem.name,
    });
    return res.status(200).json(updatedItem);
  } catch (err) {
    error("[Controller] Fout bij bijwerken van inventarisitem", {
      error: err.message,
    });
    return res.status(500).json({
      message: "Kan inventarisitem niet bijwerken",
      error: err.message,
    });
  }
};

/**
 * Update an inventory item partially (PATCH).
 */
export const updateInventoryItem = async (req, res) => {
  try {
    info("[Controller] PATCH /inventory/:id aangeroepen", {
      params: req.params,
      requestBody: req.body,
    });

    const updatedItem = await updateInventoryItemService(
      req.params.id,
      req.body
    );

    info("[Controller] Inventarisitem succesvol bijgewerkt", {
      id: updatedItem._id,
      name: updatedItem.name,
    });
    return res.status(200).json(updatedItem);
  } catch (err) {
    error("[Controller] Fout bij updaten van inventarisitem", {
      error: err.message,
    });
    return res.status(500).json({
      message: "Kan inventarisitem niet updaten",
      error: err.message,
    });
  }
};
