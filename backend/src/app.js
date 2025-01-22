import express, { urlencoded } from "express";
import connectToDatabase from "./utils/db.js";
import { info, error } from "./utils/logger.js";
import { envConfig } from "./config/env.js";
import appRouter from "./routes/routes.js";

const app = express();

const startServer = async () => {
  try {
    // Verbind met de database
    await connectToDatabase();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Middleware en routes
    app.use("", appRouter);
    // Start de server
    app.listen(envConfig.serverPort, () => {
      info(`Server draait op http://0.0.0.0:${envConfig.serverPort}`);
    });
  } catch (err) {
    console.error(`Kan server niet starten: ${err.message}`);
    process.exit(1);
  }
};

startServer();
