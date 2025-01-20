import express from "express";
import { Inventory } from "../models/Inventory.js";

const inventoryRouter = express.Router();

// Read function - Retrieve all articles
inventoryRouter.get("/inventory", async (req, res) => {
  try {
    const inventories = await Inventory.find({});
    console.log("GET meldingen");
    return res.status(200).json({ count: inventories.length, data: inventories });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default inventoryRouter;