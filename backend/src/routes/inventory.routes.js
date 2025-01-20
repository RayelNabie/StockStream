import express from "express";
import { Inventory } from "../models/Inventory.js";
import { getAllInventory } from "../controllers/inventoryController.js";

const inventoryRouter = express.Router();

// Read function - Retrieve all articles
inventoryRouter.get("/inventory", getAllInventory);

export default inventoryRouter;