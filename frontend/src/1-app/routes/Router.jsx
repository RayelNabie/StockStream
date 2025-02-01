import { Routes, Route } from "react-router-dom";
import Home from "../../2-pages/home/Home.jsx";
import PrivacyPolicy from "../../2-pages/legal-documents/privacy-policy/Privacy-Policy.jsx";
import Terms from "../../2-pages/legal-documents/terms-of-service/Terms-Of-Service.jsx";
import NotFound from "../../2-pages/Error/400-error/NotFound.jsx";
import Dashboard from "../../2-pages/inventory/overview/Dashboard.jsx";
import InventoryDetailModal from "../../2-pages/inventory/detail/InventoryDetailModal.jsx";
import InventoryEditModal from "../../2-pages/inventory/edit/InventoryEditModal.jsx";
import InventoryCreateModal from "../../2-pages/inventory/create/InventoryCreateModal.jsx";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="inventory/:id" element={<InventoryDetailModal />} />
        <Route path="inventory/:id/edit" element={<InventoryEditModal />} />
        <Route path="inventory/create" element={<InventoryCreateModal />} /> 
      </Route>
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<Terms />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
