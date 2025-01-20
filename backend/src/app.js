import express from "express";
import { connectToDatabase } from "./utils/db.js";
import { info, error } from "./utils/logger.js";
import { envConfig } from "./config/env.js";
import appRouter from "./routes/routes.js";

const app = express();

// MongoDB connection
connectToDatabase();

// Routes
app.use("", appRouter);

const startServer = async () => {
  try {
    app.listen(envConfig.port, () => {
      info(`Server draait op poort ${envConfig.port}`);
    });
  } catch (error) {
    console.log(`Kan server niet starten: ${error.message}`);
    process.exit(1);
  }
};

startServer();
