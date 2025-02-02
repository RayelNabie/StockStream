import express from "express";
import {
  getAllInventory,
  createNewInventoryItem,
  editInventoryItem,
  updateInventoryItem,
  getInventoryDetail,
  deleteInventoryItem,
} from "../controllers/inventoryController.js";
import { debug, info } from "../utils/logger.js";

const inventoryRouter = express.Router();

//Middleware voor logging van binnenkomende verzoeken
inventoryRouter.use((req, res, next) => {
  debug(
    `[Inventory Router] Verzoek ontvangen: ${req.method} ${req.originalUrl}`
  );
  next();
});

//Collectie-endpoints
inventoryRouter
  .route("/inventory")
  .get((req, res, next) => {
    info("[Router] Ophalen van alle inventarisitems gestart");
    next();
  }, getAllInventory)
  .post((req, res, next) => {
    info("[Router] Aanmaken van een nieuw inventarisitem gestart");
    next();
  }, createNewInventoryItem);

//Detail-endpoints
inventoryRouter
  .route("/inventory/:id")
  .get((req, res, next) => {
    info(`[Router] Ophalen van item met ID: ${req.params.id}`);
    next();
  }, getInventoryDetail)
  .put((req, res, next) => {
    info(`[Router] Bewerken van item met ID: ${req.params.id}`);
    next();
  }, editInventoryItem)
  .patch((req, res, next) => {
    info(`[Router] Gedeeltelijke update van item met ID: ${req.params.id}`);
    next();
  }, updateInventoryItem)
  .delete((req, res, next) => {
    info(`[Router] Verwijderen van item met ID: ${req.params.id}`);
    next();
  }, deleteInventoryItem);

export default inventoryRouter;
