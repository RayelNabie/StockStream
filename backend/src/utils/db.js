import mongoose from "mongoose";
import { envConfig } from "../config/env.js";
import { info, error } from "./logger.js";

export async function connectToDatabase() {
  try {
    // Controleer of de connectiestring bestaat
    if (!envConfig.mongoUri) {
      throw new Error(
        "Geen MongoDB-URI gedefinieerd in de omgevingsvariabelen."
      );
    }

    console.log(envConfig.mongoUri);

    // Verbinden met MongoDB
    await mongoose.connect(envConfig.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    info("Succesvol verbonden met MongoDB");
  } catch (err) {
    error(`MongoDB-verbinding mislukt: ${err.message}`);
    process.exit(1); // Stop de applicatie als de verbinding faalt
  }
}
