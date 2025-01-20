import { Router } from "express";
import inventoryRouter from "../routes/inventory.routes.js";
import { corsMiddleware } from "../middlewares/corsMiddleware.js";
import { info, error, debug } from "../utils/logger.js";

const appRouter = Router();

// Log de start van de inventory routes
info("Registering inventory routes");

// Cors middleware
appRouter.use(corsMiddleware);

// Inventory routes
appRouter.use("/StockStream", inventoryRouter);

// Fallback voor niet-bestaande routes
appRouter.use((req, res) => {
  error(`Route not found: [${req.method}] ${req.originalUrl}`);
  res.status(404).json({ ERROR: "Route not found" });
});

export default appRouter;