import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import PrivacyPolicy from "../pages/Privacy-Policy.jsx";
import Terms from "../pages/Terms-Of-Service.jsx";
import NotFound from "../pages/NotFound.jsx";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<Terms />} />
    </Routes>
  );
}
