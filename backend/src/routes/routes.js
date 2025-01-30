  import { Router } from "express";
  import inventoryRouter from "../routes/inventory.routes.js";
  import { corsMiddleware } from "../middlewares/corsMiddleware.js";
  import { authMiddleware } from "../middlewares/authMiddleware.js";
  import { info, error, debug } from "../utils/logger.js";

  const appRouter = Router();

  // Log de start van de inventory routes
  info("Registering inventory routes");

  // Log een verzoek voor CORS-middleware
  appRouter.use((req, res, next) => {
    debug(`[CORS] Verzoek ontvangen: ${req.method} ${req.originalUrl}`);
    next();
  });

  // Cors middleware
  appRouter.use(corsMiddleware);
  info("[CORS] CORS middleware succesvol toegepast");

  // Inventory routes
  appRouter.use("/", inventoryRouter);
  info("[Routes] Inventory routes succesvol geregistreerd op /inventory");

  // Fallback voor niet-bestaande routes
  appRouter.use((req, res) => {
    error(`Route not found: [${req.method}] ${req.originalUrl}`);
    res.status(404).json({ ERROR: "Route not found" });
  });

  export default appRouter;
