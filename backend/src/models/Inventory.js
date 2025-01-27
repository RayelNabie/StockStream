import mongoose from "mongoose";

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
      type: String,
      required: true,
      default: "0",
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
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        // Hernoem `_id` naar `id`
        ret.id = ret._id;
        delete ret._id;

        // Voeg `_links` toe aan de output
        ret._links = {
          self: {
            href: `http://127.0.0.1:8000/inventory/${ret.id}`,
          },
          collection: {
            href: `http://127.0.0.1:8000/inventory`,
          },
        };

        // Verwijder velden die niet nodig zijn in de JSON-uitvoer
        delete ret.__v;
        delete ret.timestamps;
        return ret;
      },
    },
  }
);

export const Inventory = mongoose.model("Inventory", inventorySchema);