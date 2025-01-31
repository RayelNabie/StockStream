// import { useState } from 'react'
import Router from "./routes/Router.jsx";
import Navbar from "../shared/components/Navbar.jsx";
import Footer from "../shared/components/Footer.jsx";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow mt-16">
        <Router />
      </main>
      <Footer />
    </div>
  );
}
