function CartModal({ cart, onClose, onCheckout, onRemoveItem }) {
  return (
    <div
      className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-20 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl mb-4 text-neutral-500">Warenkorb</h2>
        {cart.length === 0 ? (
          <p className="text-neutral-400">Ihr Warenkorb ist leer.</p>
        ) : (
          <ul className="mb-4 max-h-60 overflow-y-auto">
            {cart.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b border-gray-200 py-2 text-neutral-400"
              >
                <span className="font-medium">
                  {item.title} (€ {item.price.toFixed(2)})
                </span>
                <button
                  onClick={() => onRemoveItem(index)}
                  className="text-red-500 text-xl leading-none"
                  aria-label={`Entferne ${item.title} aus dem Warenkorb`}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="font-semibold text-lg text-neutral-600 mb-2">
          Summe: €{" "}
          {cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
        </p>
        <button
          onClick={onCheckout}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full mb-2"
        >
          Kaufen
        </button>
        <button
          onClick={onClose}
          className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded w-full"
        >
          Schließen
        </button>
      </div>
    </div>
  );
}

export default CartModal;
