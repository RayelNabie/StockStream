import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Vereist veld
      trim: true,
    },
    description: {
      type: String,
      trim: true, // Vrije invoer
    },
    sku: {
      type: String,
      required: true, // Vereist veld
      unique: true,
      trim: true,
    },
    quantity: {
      type: String, // Veranderd naar String om vrije invoer mogelijk te maken
      required: true, // Vereist veld
      trim: true,
    },
    price: {
      type: String, // Veranderd naar String om vrije invoer mogelijk te maken
      required: true, // Vereist veld
      trim: true,
    },
    category: {
      type: String, // Vrije invoer toegestaan
      trim: true,
    },
    supplier: {
      type: String, // Vrije invoer toegestaan
      trim: true,
    },
    status: {
      type: Boolean, 
      required: true, 
    },
    lowStockThreshold: {
      type: String, // Veranderd naar String om vrije invoer mogelijk te maken
      trim: true,
    },
    barcode: {
      type: String, // Barcode als string voor vrije invoer
      unique: true,
      sparse: true,
    },
    location: {
      type: String, // Vrije invoer toegestaan
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Inventory = mongoose.model("Inventory", inventorySchema);