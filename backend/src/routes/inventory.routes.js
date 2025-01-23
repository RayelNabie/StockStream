import express from "express";
import {
  getAllInventory,
  createNewInventoryItem,
  editInventoryItem,
  updateInventoryItem,
  getInventoryDetail,
} from "../controllers/inventoryController.js";
import { hateoasMiddleware } from "../middlewares/hateOASMiddleware.js";
import { debug } from "../utils/logger.js";

const inventoryRouter = express.Router();

// Logging bij binnenkomst in de route
inventoryRouter.use((req, res, next) => {
  debug(
    `[Inventory Router] Verzoek ontvangen: ${req.method} ${req.originalUrl}`
  );
  next();
});

// Collectie-endpoints (GET en POST)
inventoryRouter.get(
  "/inventory",
  getAllInventory,
  hateoasMiddleware("/inventory")
);
inventoryRouter.post(
  "/inventory",
  createNewInventoryItem,
  hateoasMiddleware("/inventory")
);

// Detail-endpoints (GET, PUT, PATCH)
inventoryRouter.get(
  "/inventory/:id",
  getInventoryDetail,
  hateoasMiddleware("/inventory")
);
inventoryRouter.put(
  "/inventory/:id",
  editInventoryItem,
  hateoasMiddleware("/inventory")
);
inventoryRouter.patch(
  "/inventory/:id",
  updateInventoryItem,
  hateoasMiddleware("/inventory")
);

export default inventoryRouter;
