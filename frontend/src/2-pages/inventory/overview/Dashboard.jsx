import { Link, Outlet } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import InventoryGrid from "../../../3-widgets/inventory/InventoryGrid";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="w-full bg-white shadow-md py-6 px-8 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Voorraadbeheer
        </h1>

        <Link
          to="/dashboard/inventory/create"
          className="mt-4 sm:mt-0 flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all"
        >
          <FaPlus /> Nieuw Product
        </Link>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <InventoryGrid />
      </main>

      <Outlet />
    </div>
  );
}
