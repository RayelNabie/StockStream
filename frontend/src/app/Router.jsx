import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx"
import NotFound from "../pages/NotFound.jsx";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
