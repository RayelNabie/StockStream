import { info, error } from "../utils/logger";

// Middleware voor CORS en header-validatie
export const corsMiddleware = (req, res, next) => {
  //Cors Headers
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
};
