import { Inventory } from "../../models/Inventory.js";
import { faker } from "@faker-js/faker";
import { info, error } from "../../utils/logger.js";

// Functie om één inventarisitem te genereren
const generateInventoryItem = () => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  sku: faker.string.alphanumeric(8),
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
const generateInventoryItems = (count = 50) => {
  info(`Genereren van ${count} inventarisitems...`);
  return Array.from({ length: count }, () => generateInventoryItem());
};

// Seeder object voor inventaris
const inventorySeeder = {
  name: "InventorySeeder",
  run: async () => {
    try {
      info("Verwijderen van bestaande inventaris...");
      await Inventory.deleteMany({});

      info("Genereren van nieuwe inventarisgegevens...");
      const inventoryItems = generateInventoryItems();

      info("Invoegen van nieuwe inventarisitems in de database...");
      await Inventory.insertMany(inventoryItems);

      info("InventorySeeder succesvol voltooid.");
    } catch (err) {
      error("Fout in InventorySeeder", { error: err.message });
      throw err;
    }
  },
};

export default inventorySeeder;