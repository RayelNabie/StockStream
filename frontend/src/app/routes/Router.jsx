import { Routes, Route } from "react-router-dom";
import Home from "../../pages/home/Home.jsx";
import PrivacyPolicy from "../../pages/legal-documents/privacy-policy/Privacy-Policy.jsx";
import Terms from "../../pages/legal-documents/terms-of-service/Terms-Of-Service.jsx";
import NotFound from "../../pages/Error/400-error/NotFound.jsx";
import Dashboard from "../../pages/inventory-read/Dashboard.jsx"

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<Terms />} />
    </Routes>
  );
}
