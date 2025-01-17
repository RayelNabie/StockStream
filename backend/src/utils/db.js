import mongoose from "mongoose";
import { dbConfig } from "./dbConfig.js";
import { info, error } from "./logger.js";

export async function connectToDatabase() {
  try {
    // Controleer of de connectiestring bestaat
    if (!dbConfig.mongoUri) {
      throw new Error(
        "Geen MongoDB-URI gedefinieerd in de omgevingsvariabelen."
      );
    }

    console.log(dbConfig.mongoUri);

    // Verbinden met MongoDB
    await mongoose.connect(dbConfig.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    info("Succesvol verbonden met MongoDB");
  } catch (err) {
    error(`MongoDB-verbinding mislukt: ${err.message}`);
    process.exit(1); // Stop de applicatie als de verbinding faalt
  }
}
