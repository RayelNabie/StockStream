import mongoose from "mongoose";
import connectToDatabase from "../utils/db.js";
import userSeeder from "./seeders/userSeeder.js";
import inventorySeeder from "./seeders/inventorySeeder.js";
import { info, error } from "../utils/logger.js";

const seeders = [userSeeder, inventorySeeder];

const seedDB = async () => {
  try {
    info("Connecting to database...");
    await connectToDatabase();
    info("Connected to the database");

    for (const seeder of seeders) {
      info(`Running seeder: ${seeder.name}`);
      await seeder.run();
    }

    info("Seeding completed successfully!");
  } catch (err) {
    error("An error occurred while seeding the database");
    error(err.message);
  } finally {
    await mongoose.connection.close();
    info("Database connection closed");
  }
};

seedDB();