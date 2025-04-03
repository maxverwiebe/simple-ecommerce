import { useState } from "react";

// Produkt-Detail-Modal mit Image-Gallery
function ProductModal({ product, onClose, onAddToCart }) {
  const [selectedImage, setSelectedImage] = useState(
    product.images && product.images.length > 0 ? product.images[0] : null
  );

  return (
    <div
      className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-20 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        {selectedImage && (
          <img
            src={selectedImage}
            alt={`${product.name} image`}
            className="w-full h-64 object-cover mb-4 rounded"
          />
        )}

        {product.images && product.images.length > 1 && (
          <div className="flex space-x-2 mb-4 overflow-x-auto">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover rounded cursor-pointer flex-shrink-0 ${
                  selectedImage === img ? "ring-2 ring-blue-600" : ""
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        )}

        <h2 className="text-2xl mb-4 text-neutral-500">{product.name}</h2>
        <p className="text-neutral-400">{product.description}</p>
        <div className="max-h-[10vh] overflow-y-auto">
          <p className="text-neutral-400">{product?.descriptionLong}</p>
        </div>
        <p className="mt-2 font-semibold text-lg text-neutral-600">
          € {product.price.toFixed(2)}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              onAddToCart(product);
              onClose();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded flex-1"
          >
            In den Warenkorb
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-6 rounded flex-1"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
