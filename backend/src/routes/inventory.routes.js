import express from "express";
import { getAllInventory } from "../controllers/inventoryController.js";
import { info, debug, error } from "../utils/logger.js";

const inventoryRouter = express.Router();

// Logging bij binnenkomst in de route
inventoryRouter.use((req, res, next) => {
  debug(`[Inventory Router] Verzoek ontvangen: ${req.method} ${req.originalUrl}`);
  next();
});

// Read function - Retrieve all inventory items
inventoryRouter.get("/inventory", async (req, res) => {
  try {
    info(`[Route] GET /inventory aangeroepen`);
    const inventory = await getAllInventory();
    debug(`[Route] Voorraad succesvol opgehaald: ${JSON.stringify(inventory)}`);
    res.status(200).json(inventory);
  } catch (err) {
    error(`[Route] Fout bij ophalen van voorraad: ${err.message}`);
    res.status(500).json({ ERROR: "Kan voorraad niet ophalen" });
  }
});

export default inventoryRouter;