import express from "express";
import { envConfig } from "./config/env.js";
import { connectToDatabase } from "./utils/db.js";
import { info, error } from "./utils/logger.js";

// Applicatie-initialisatie
const app = express();

// Middleware (optioneel)
app.use(express.json());

// Verbinden met de database
async () => {
  try {
    info("Probeert verbinding te maken met de server :S");
    await connectToDatabase();
    info("Verbonden met de Server :)");
    app.listen(envConfig.port, () => {
      info(`Server draait op poort ${envConfig.port}`);
    });
  } catch (err) {
    error(`Fout bij het starten van de server: ${err.message}`);
  }
};
