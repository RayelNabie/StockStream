import express from "express";
import {
  getAllInventory,
  createNewInventoryItem,
  editInventoryItem,
  updateInventoryItem,
  getInventoryDetail,
  deleteInventoryItem,
} from "../controllers/inventoryController.js";
import { debug } from "../utils/logger.js";

const inventoryRouter = express.Router();

// Apply HATEOAS middleware to all routes in this router
inventoryRouter.use((req, res, next) => {
  debug(
    `[Inventory Router] Verzoek ontvangen: ${req.method} ${req.originalUrl}`
  );
  next();
});

// Collectie-endpoints (GET en POST)
inventoryRouter.get("/inventory", getAllInventory);
inventoryRouter.post("/inventory", createNewInventoryItem);

// Detail-endpoints (GET, PUT, PATCH)
inventoryRouter.get("/inventory/:id", getInventoryDetail);
inventoryRouter.put("/inventory/:id", editInventoryItem);
inventoryRouter.patch("/inventory/:id", updateInventoryItem);
inventoryRouter.delete("/inventory/:id", deleteInventoryItem);

export default inventoryRouter;
