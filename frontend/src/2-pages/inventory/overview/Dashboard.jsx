import InventoryGrid from "../../../3-widgets/inventory/InventoryGrid";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen items-center text-center px-8 gap-6 pt-24">
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
        Dashboard
      </h1>

      <div className="w-full mt-12">
        <InventoryGrid />
        <Outlet/>
      </div>
    </div>
  );
}
