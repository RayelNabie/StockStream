import { FaTimes } from "react-icons/fa";

export default function InventoryDetailModal({ item, isOpen, onClose }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center sm:justify-end transition-opacity duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        className={`absolute inset-0 backdrop-blur-lg transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed bg-white shadow-lg transform transition-transform duration-300 ease-in-out p-6 
        rounded-t-2xl sm:rounded-l-2xl
        ${
          isOpen
            ? "translate-y-0 sm:translate-x-0"
            : "translate-y-full sm:translate-x-full"
        } 
        w-[100%] sm:w-[40%] h-[90%] sm:h-[100%] bottom-0 sm:top-1/2 sm:right-0 sm:-translate-y-1/2`}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>

        {item ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
            <p className="text-gray-600 mb-2">{item.description}</p>
            <p className="text-sm text-gray-500">SKU: {item.sku}</p>
            <p className="text-sm text-gray-500">Categorie: {item.category}</p>
            <p className="text-sm text-gray-500">Voorraad: {item.quantity}</p>
            <p className="text-sm text-gray-500">Locatie: {item.location}</p>

            <div className="mt-4">
              <a
                href={item._links?.self?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Bekijk in API
              </a>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Laden...</p>
        )}
      </div>
    </div>
  );
}
