import mongoose from "mongoose";
import connectToDatabase from "../utils/db.js";
import userSeeder from "./seeders/userSeeder.js";
import inventorySeeder from "./seeders/inventorySeeder.js";
import { info, error } from "../utils/logger.js";

const seeders = [userSeeder, inventorySeeder];

const seedDB = async () => {
  try {
    info("🔗 Verbinding maken met de database...");
    await connectToDatabase();
    info("✅ Verbonden met de database");

    for (const seeder of seeders) {
      info(`🚀 Seeder gestart: ${seeder.name}`);
      await seeder.run();
      info(`✅ Seeder voltooid: ${seeder.name}`);
    }

    info("🎉 Alle seeders succesvol uitgevoerd!");
  } catch (err) {
    error("❌ Fout opgetreden tijdens het seeden van de database");
    error(`🔍 Foutmelding: ${err.message}`);
  } finally {
    await mongoose.connection.close();
    info("🔌 Databaseverbinding gesloten");
  }
};

seedDB();