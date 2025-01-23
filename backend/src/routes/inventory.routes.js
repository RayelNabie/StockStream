import express from "express";
import {
  getAllInventory,
  createNewInventoryItem,
  editInventoryItem,
  updateInventoryItem,
  getInventoryDetail
} from "../controllers/inventoryController.js";
import { info, debug, error } from "../utils/logger.js";

const inventoryRouter = express.Router();

// Logging bij binnenkomst in de route
inventoryRouter.use((req, res, next) => {
  debug(
    `[Inventory Router] Verzoek ontvangen: ${req.method} ${req.originalUrl}`
  );
  next();
});

// Read function - Retrieve all inventory items
inventoryRouter.get("/inventory", getAllInventory);

inventoryRouter.get("/inventory/:id", getInventoryDetail);

inventoryRouter.post("/inventory", createNewInventoryItem);

inventoryRouter.put("/inventory/:id", editInventoryItem);

inventoryRouter.patch("/inventory/:id", updateInventoryItem);

export default inventoryRouter;
