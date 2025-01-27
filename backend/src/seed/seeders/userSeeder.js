import { Inventory } from "../../models/Inventory.js";
import { faker } from "@faker-js/faker";
import { info, error } from "../../utils/logger.js";

const generateInventoryItem = () => ({
  name: faker.commerce.productName(), // Genereert een productnaam
  description: faker.commerce.productDescription(), // Genereert een productomschrijving
  sku: faker.string.alphanumeric(8).toUpperCase(), // Genereert een SKU van 8 tekens
  quantity: faker.number.int({ min: 1, max: 100 }).toString(), // Genereert een hoeveelheid als string
  category: faker.helpers.arrayElement([
    "Electronics",
    "Office Supplies",
    "Accessories",
    "Furniture",
    "Storage",
  ]), // Random categorie
  supplier: faker.company.name(), // Genereert een leveranciersnaam
  status: faker.datatype.boolean(), // Boolean waarde voor status
  barcode: faker.string.numeric(13), // Genereert een numerieke barcode van 13 cijfers
  location: `Aisle ${faker.number.int({ min: 1, max: 10 })}, Shelf ${faker.string.alpha({ length: 1 }).toUpperCase()}`, // Locatie-indeling
  createdAt: faker.date.past(), // Datum in het verleden
  updatedAt: faker.date.recent(), // Datum in de nabije toekomst
});

const inventorySeeder = {
  name: "InventorySeeder",
  run: async () => {
    try {
      info("Clearing existing inventory...");
      await Inventory.deleteMany({});
      info("Generating inventory data...");

      const inventoryData = Array.from({ length: 10 }, generateInventoryItem); // Genereer 10 items
      await Inventory.insertMany(inventoryData);

      info("InventorySeeder completed successfully");
    } catch (err) {
      error("Error in InventorySeeder");
      throw err;
    }
  },
};

export default inventorySeeder;