import express from 'express';
import { connectToDatabase } from './utils/db.js';
import { info, error } from './utils/logger.js';
import { envConfig } from './config/env.js';

const app = express();

(async () => {
  try {
    // Maak verbinding met de database
    await connectToDatabase();

    // Start de server
    app.listen(envConfig.port, () => {
      info(`Server draait op poort ${envConfig.port}`);
    });
  } catch (err) {
    error(`Kan server niet starten: ${err.message}`);
    process.exit(1); // Stop applicatie bij fouten
  }
})();