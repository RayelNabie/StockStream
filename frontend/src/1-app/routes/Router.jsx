import { Routes, Route } from "react-router-dom";
import Home from "../../2-pages/home/Home.jsx";
import PrivacyPolicy from "../../2-pages/legal-documents/privacy-policy/Privacy-Policy.jsx";
import Terms from "../../2-pages/legal-documents/terms-of-service/Terms-Of-Service.jsx";
import NotFound from "../../2-pages/Error/400-error/NotFound.jsx";
import Dashboard from "../../2-pages/inventory/overview/Dashboard.jsx"

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
