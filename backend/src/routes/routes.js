import { Router } from "express";
import inventoryRouter from "../routes/inventory.routes.js";
import { info, error, debug } from "../utils/logger.js"; // Importeer de logger

const appRouter = Router();

// Middleware voor CORS en header-validatie
appRouter.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

  // Log inkomende verzoeken
  info(`[${req.method}] ${req.originalUrl}`);

  // Controleer of de Accept-header correct is
  if (req.headers?.accept === "application/json") {
    next();
  } else {
    error(
      `Incorrect header: Expected application/json, received ${req.headers.accept}`
    );
    res
      .status(400)
      .json({ ERROR: "Incorrect header, please send application/json" });
  }
});

// Log de start van de inventory routes
info("Registering inventory routes");

// Inventory routes
appRouter.use("/StockStream", inventoryRouter);

// Fallback voor niet-bestaande routes
appRouter.use((req, res) => {
  error(`Route not found: [${req.method}] ${req.originalUrl}`);
  res.status(404).json({ ERROR: "Route not found" });
});

export default appRouter;