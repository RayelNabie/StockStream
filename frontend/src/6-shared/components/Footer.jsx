import { Link } from "react-router-dom";
import { FaBoxes } from "react-icons/fa"; // 📦 Voorraadbeheer icoon

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-600 w-full py-6">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="flex items-center space-x-3">
          <FaBoxes className="h-8 w-8 text-blue-600 dark:text-white" />
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            StockStream
          </span>
        </div>

        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
          >
            Contact
          </Link>
        </div>

        <div className="text-gray-500 space-x-6 text-sm mt-4 md:mt-2">
          <Link
            to="/privacy-policy"
            className="text-gray-500 text-sm mt-4 md:mt-0"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-service"
            className="text-gray-500 text-sm mt-4 md:mt-0"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
