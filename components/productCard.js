import React from "react";

export default function ProductCard({ product, onShowDetails, onAddToCart }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-4 flex flex-col">
      {product.image && (
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {product.title}
      </h3>
      <p className="text-gray-600 text-sm flex-grow">
        {product.description.length > 100
          ? product.description.slice(0, 100) + "..."
          : product.description}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-blue-700">
          € {product.price.toFixed(2)}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onShowDetails(product)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-3  text-sm rounded-lg transition-colors duration-200 shadow-md "
          >
            Details
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="ml-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 shadow-md flex items-center"
          >
            <span className="mr-2">+</span>
            In den Warenkorb
          </button>
        </div>
      </div>
    </div>
  );
}
