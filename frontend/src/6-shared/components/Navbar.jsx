import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBoxes } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white md:bg-transparent hover:bg-white backdrop-blur-lg fixed w-[95%] md:w-[60%] z-20 top-1.5 left-1/2 transform -translate-x-1/2 border-b border-black rounded-4xl">
      <div className="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className="flex items-center space-x-3">
            <FaBoxes className="h-8 w-8 text-yellow-400" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-yellow-400">
              StockStream
            </span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="md:hidden inline-flex items-center p-2 w-10 h-10 justify-center  bg-white backdrop-blur-lg "
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
          className={`${isOpen ? "block" : "hidden"} w-full md:flex md:w-auto`}
          id="navbar-sticky"
        >
          <ul className="w-full flex flex-col md:flex-row md:space-x-6 text-center md:text-left p-4 md:p-0">
            <li>
              <Link
                to="/"
                className="block text-l font-semibold text-black hover:bg-gray-100 rounded-3xl p-3"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="block text-l font-semibold text-black hover:bg-gray-100 rounded-3xl p-3"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="block text-l font-semibold text-black hover:bg-gray-100 rounded-3xl p-3"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="block text-l font-semibold text-black hover:bg-gray-100 rounded-3xl p-3"
              >
                Contact
              </Link>
            </li>

            <li className="md:hidden">
              <Link
                to="/Dashboard"
                className="w-full text-l font-semibold text-black bg-yellow-400 border border-yellow-300 hover:bg-yellow-600 rounded-3xl p-2"
              >
                Voorraadbeheer
              </Link>
            </li>
          </ul>
        </div>

        <div className="hidden md:flex">
          <Link
            to="/Dashboard"
            className="w-full text-l font-semibold text-black bg-yellow-400 border border-yellow-300 hover:bg-yellow-600 rounded-3xl p-3"
          >
            Voorraadbeheer
          </Link>
        </div>
      </div>
    </nav>
  );
}
