import { Inventory } from "../../models/Inventory.js";
import { faker } from "@faker-js/faker";
import { info, error } from "../../utils/logger.js";

// Functie om één inventarisitem te genereren
const generateInventoryItem = () => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  sku: faker.string.alphanumeric(8), // Let op: 'alphanumeric' met kleine letters
  quantity: faker.number.int({ min: 1, max: 100 }).toString(),
  category: faker.commerce.department(),
  supplier: faker.company.name(),
  status: faker.datatype.boolean(),
  barcode: faker.string.numeric(13),
  location: `Aisle ${faker.number.int({ min: 1, max: 10 })}, Shelf ${faker.string.alpha({ length: 1 }).toUpperCase()}`,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});

// Functie om meerdere inventarisitems te genereren
const generateInventoryItems = (count = 50) => Array.from({ length: count }, () => generateInventoryItem());

// Seeder object voor inventaris
const inventorySeeder = {
  name: "InventorySeeder",
  run: async () => {
    try {
      info("Clearing existing inventory...");
      await Inventory.deleteMany({});

      info("Generating inventory data...");
      const inventoryItems = generateInventoryItems();

      info("Inserting new inventory items...");
      await Inventory.insertMany(inventoryItems);

      info("InventorySeeder completed successfully");
    } catch (err) {
      error("Error in InventorySeeder");
      throw err;
    }
  },
};

export default inventorySeeder;