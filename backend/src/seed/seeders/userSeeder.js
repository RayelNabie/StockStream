import {User} from "../../models/User.js";
import userModelSeeder from "../modelseeders/userSeeder.js";
import { info, error } from "../../utils/logger.js";

const userSeeder = {
  name: "UserSeeder",
  run: async () => {
    try {
      info("Clearing existing users...");
      await User.deleteMany({}); // Clear the collection
      info("Inserting new users...");
      await User.insertMany(userModelSeeder); // Insert seed data
      info("UserSeeder completed successfully");
    } catch (err) {
      error("Error in UserSeeder");
      throw err; // Allow the seeder manager to handle the error
    }
  },
};

export default userSeeder;