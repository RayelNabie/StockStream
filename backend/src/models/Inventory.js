import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      trim: true,
    },
    supplier: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
    barcode: {
      type: String,
      unique: true,
      sparse: true,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Inventory = mongoose.model('Inventory', inventorySchema);