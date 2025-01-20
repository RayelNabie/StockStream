import express from "express";
import { connectToDatabase } from "./utils/db.js";
import { info, error } from "./utils/logger.js";
import { envConfig } from "./config/env.js";
import appRouter from "./routes/routes.js";

const app = express();

const startServer = async () => {
  try {
    // Verbind met de database
    await connectToDatabase();

    // Middleware en routes
    app.use("", appRouter);

    // Start de server
    app.listen(envConfig.port, () => {
      info(`Server draait op http://localhost:${envConfig.port}`);
    });
  } catch (err) {
    console.error(`Kan server niet starten: ${err.message}`);
    process.exit(1);
  }
};

startServer();
