import mongoose from "mongoose";
import { envConfig } from "../config/env.js";
import { info, error } from "./logger.js";

export async function connectToDatabase() {
  try {
    if (!envConfig.mongoUri) {
      throw new Error(
        "Geen MongoDB-URI gedefinieerd in de omgevingsvariabelen."
      );
    }

    // Log de samengestelde URI
    info(`Verbinding maken met MongoDB op: ${envConfig.mongoUri}`);

    // Verbind met MongoDB
    await mongoose.connect(envConfig.mongoUri);

    info("Succesvol verbonden met MongoDB");
  } catch (err) {
    error(`MongoDB-verbinding mislukt: ${err.message}`);
    process.exit(1);
  }
}
