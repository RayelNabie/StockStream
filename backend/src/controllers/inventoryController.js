import { Inventory } from "../models/Inventory.js";
import { info, debug, error } from "../utils/logger.js";
import {
  createInventoryItem,
  validateInventoryData,
  assignBarcode,
} from "../services/inventoryServices/inventoryService.js";

/**
 * Haal de details van een specifiek inventarisitem op.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getInventoryDetail = async (req, res) => {
  try {
    info("[Controller] GET /inventory/:id aangeroepen", { params: req.params });

    const inventoryItem = await Inventory.findById(req.params.id);

    if (!inventoryItem) {
      info("[Controller] Geen inventarisitem gevonden", { id: req.params.id });
      return res.status(404).json({ message: "Inventarisitem niet gevonden" });
    }

    info("[Controller] Inventarisitem details succesvol opgehaald", {
      id: inventoryItem._id,
      name: inventoryItem.name,
    });
    return res.status(200).json(inventoryItem);
  } catch (err) {
    error("[Controller] Fout bij ophalen van inventarisitem details", {
      error: err.message,
      params: req.params,
    });
    return res
      .status(500)
      .json({
        message: "Fout bij ophalen van inventarisitem details",
        error: err.message,
      });
  }
};

/**
 * Haal alle voorraaditems op.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getAllInventory = async (req, res) => {
  try {
    info("[Controller] GET /inventory aangeroepen");

    const inventory = await Inventory.find({});
    debug("[Controller] Voorraad succesvol opgehaald", {
      itemCount: inventory.length,
    });

    return res.status(200).json(inventory);
  } catch (err) {
    error("[Controller] Fout bij ophalen van voorraad", { error: err.message });
    return res
      .status(500)
      .json({ message: "Fout bij ophalen van voorraad", error: err.message });
  }
};

/**
 * Maak een nieuw inventarisitem aan.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

export const createNewInventoryItem = async (req, res) => {
  try {
    info("[Controller] POST /inventory aangeroepen", { requestBody: req.body });

    // Validatie
    const validationErrors = validateInventoryData(req.body);
    if (validationErrors.length > 0) {
      info("[Controller] Validatiefouten aangetroffen", {
        errors: validationErrors,
      });
      return res.status(400).json({
        message: "Validatiefouten",
        errors: validationErrors,
      });
    }

    // Maak een nieuw inventarisitem
    const newItem = await createInventoryItem(req.body);
    info("[Controller] Inventarisitem succesvol aangemaakt", {
      id: newItem._id,
      name: newItem.name,
    });

    return res.status(201).json(newItem);
  } catch (err) {
    error("[Controller] Fout bij toevoegen van inventaris", {
      error: err.message,
    });
    return res.status(500).json({
      message: "Kan inventaris niet toevoegen",
      error: err.message,
    });
  }
};

/**
 * Bewerk een bestaand inventarisitem.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

export const editInventoryItem = async (req, res) => {
  try {
    info("[Controller] PUT /inventory/:id aangeroepen", {
      params: req.params,
      requestBody: req.body,
    });

    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Retourneer het bijgewerkte document
        runValidators: true, // Zorg dat validaties worden uitgevoerd
      }
    );

    if (!updatedItem) {
      info("[Controller] Geen inventarisitem gevonden om bij te werken", {
        id: req.params.id,
      });
      return res.status(404).json({ message: "Inventarisitem niet gevonden" });
    }

    info("[Controller] Inventarisitem succesvol bijgewerkt", {
      id: updatedItem._id,
      name: updatedItem.name,
    });
    return res.status(200).json(updatedItem);
  } catch (err) {
    error("[Controller] Fout bij bijwerken van inventarisitem", {
      error: err.message,
    });
    return res
      .status(500)
      .json({
        message: "Kan inventarisitem niet bijwerken",
        error: err.message,
      });
  }
};

/**
 * Update een veld of meerdere velden van een bestaand inventarisitem.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const updateInventoryItem = async (req, res) => {
  try {
    info("[Controller] PATCH /inventory/:id aangeroepen", {
      params: req.params,
      requestBody: req.body,
    });

    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Retourneer het bijgewerkte document
        runValidators: true, // Zorg dat validaties worden uitgevoerd
      }
    );

    if (!updatedItem) {
      info("[Controller] Geen inventarisitem gevonden om bij te werken", {
        id: req.params.id,
      });
      return res.status(404).json({ message: "Inventarisitem niet gevonden" });
    }

    info("[Controller] Inventarisitem succesvol bijgewerkt", {
      id: updatedItem._id,
      name: updatedItem.name,
    });
    return res.status(200).json(updatedItem);
  } catch (err) {
    error("[Controller] Fout bij updaten van inventarisitem", {
      error: err.message,
    });
    return res
      .status(500)
      .json({ message: "Kan inventarisitem niet updaten", error: err.message });
  }
};
