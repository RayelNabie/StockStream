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
inventoryRouter.route("/inventory").get(getAllInventory);
inventoryRouter.route("/inventory").post(createNewInventoryItem);

// Detail-endpoints (GET, PUT, PATCH)
inventoryRouter.route("/inventory/:id").get(getInventoryDetail);
inventoryRouter.route("/inventory/:id").put(editInventoryItem);
inventoryRouter.route("/inventory/:id").patch(updateInventoryItem);
inventoryRouter.route("/inventory/:id").delete(deleteInventoryItem);

export default inventoryRouter;
