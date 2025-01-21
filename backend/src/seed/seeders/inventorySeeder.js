import {Inventory} from "../../models/Inventory.js";
import inventoryModelSeeder from "../modelseeders/inventorySeeder.js";
import { info, error } from "../../utils/logger.js";

const inventorySeeder = {
  name: "InventorySeeder",
  run: async () => {
    try {
      info("Clearing existing inventory...");
      await Inventory.deleteMany({});
      info("Inserting new inventory items...");
      await Inventory.insertMany(inventoryModelSeeder);
      info("InventorySeeder completed successfully");
    } catch (err) {
      error("Error in InventorySeeder");
      throw err;
    }
  },
};

export default inventorySeeder;