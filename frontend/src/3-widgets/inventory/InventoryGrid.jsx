// src/widgets/InventoryGrid.jsx
import InventoryList from "../../features/inventory/InventoryList";

export default function InventoryGrid() {
  return (
    <section className="container mx-auto py-8">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Inventory Items
      </h2>
      <InventoryList />
    </section>
  );
}