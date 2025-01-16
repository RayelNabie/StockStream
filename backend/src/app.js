import express from 'express';
import { config } from './config/env.js';
import { connectToDatabase } from './config/db.js';
import { info, error } from './utils/logger.js';

// Applicatie-initialisatie
const app = express();

// Middleware (optioneel)
app.use(express.json());

// Verbinden met de database
(async () => {
  try {
    await connectToDatabase();
    app.listen(config.port, () => {
      info(`Server draait op poort ${config.port}`);
    });
  } catch (err) {
    error(`Fout bij het starten van de server: ${err.message}`);
  }
})();