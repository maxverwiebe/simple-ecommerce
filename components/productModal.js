import { useEffect } from "react";

function ProductModal({ product, onClose, onAddToCart }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-20 p-4 transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl transform transition-all duration-300 scale-100">
        <button
          onClick={onClose}
          aria-label="Schließen"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          ✕
        </button>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-64 object-contain mb-4 rounded"
        />
        <h2
          id="modal-title"
          className="text-2xl font-semibold mb-2 text-neutral-800"
        >
          {product.title}
        </h2>
        <p className="text-neutral-500 mb-4">{product.description}</p>
        <p className="text-lg font-bold text-neutral-700 mb-6">
          € {product.price.toFixed(2)}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              onAddToCart(product);
              onClose();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded flex-1 transition-colors duration-200"
          >
            In den Warenkorb
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-6 rounded flex-1 transition-colors duration-200"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
