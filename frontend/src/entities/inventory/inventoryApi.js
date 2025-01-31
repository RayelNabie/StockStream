import apiRequest from "../../shared/utils/apiConnection.js";

export async function fetchInventory() {
  return await apiRequest("/inventory"); // Haal alle inventarisitems op
}