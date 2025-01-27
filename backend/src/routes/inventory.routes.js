import express from "express";
import {
  getAllInventory,
  createNewInventoryItem,
  editInventoryItem,
  updateInventoryItem,
  getInventoryDetail,
} from "../controllers/inventoryController.js";
// import { HalMiddleware } from "../middlewares/hateOASMiddleware.js";
import { debug } from "../utils/logger.js";

const inventoryRouter = express.Router();

// Apply HATEOAS middleware to all routes in this router
inventoryRouter.use((req, res, next) => {
  debug(`[Inventory Router] Verzoek ontvangen: ${req.method} ${req.originalUrl}`);
  next();
});

// inventoryRouter.use(HalMiddleware("/inventory"));

// Collectie-endpoints (GET en POST)
inventoryRouter.get("/inventory", getAllInventory);
inventoryRouter.post("/inventory", createNewInventoryItem);

// Detail-endpoints (GET, PUT, PATCH)
inventoryRouter.get("/inventory/:id", getInventoryDetail);
inventoryRouter.put("/inventory/:id", editInventoryItem);
inventoryRouter.patch("/inventory/:id", updateInventoryItem);

export default inventoryRouter;
