import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBoxes } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white backdrop-blur-lg fixed w-[60%] z-20 top-1.5 left-1/2 transform -translate-x-1/2 border-b border-black rounded-4xl">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-around mx-auto">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <FaBoxes className="h-8 w-8 text-yellow-400" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-yellow-400">
            StockStream
          </span>
        </Link>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="block text-l font-semibold whitespace-nowrap text-black bg-yellow-400 border-1 border-yellow-300 hover:bg-yellow-600 rounded-3xl p-3"
          >
            Gratis Starten
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        <div
          className={`items-center justify-around ${
            isOpen ? "block" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-sticky"
        >
          <ul className="w-full md:flex md:w-auto md:order-1 p-4 space-x-6">
            <li>
              <Link
                to="/"
                className="block text-l font-semibold whitespace-nowrap text-black hover:bg-gray-100 rounded-3xl p-3"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="block text-l font-semibold whitespace-nowrap text-black hover:bg-gray-100 rounded-3xl p-3"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="block text-l font-semibold whitespace-nowrap text-black hover:bg-gray-100 rounded-3xl p-3"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="block text-l font-semibold whitespace-nowrap text-black hover:bg-gray-100 rounded-3xl p-3"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
