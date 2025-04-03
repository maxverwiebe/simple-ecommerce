import { useState } from "react";

function PurchaseModal({ cart, onClose, onCheckoutSuccess }) {
  // Separate States für die Adressfelder
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validierung der Adressfelder
    if (
      !street.trim() ||
      !houseNumber.trim() ||
      !postalCode.trim() ||
      !city.trim()
    ) {
      setErrorMessage("Bitte füllen Sie alle Adressfelder vollständig aus.");
      return;
    }

    const shippingAddress = {
      street,
      houseNumber,
      postalCode,
      city,
    };

    const productIDList = cart.map((item) => item.id);

    const payload = {
      productIDList,
      shippingAddress,
      paymentMethod,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        onCheckoutSuccess(data.message);
      } else {
        setErrorMessage("Fehler beim Checkout: " + data.message);
      }
    } catch (error) {
      setErrorMessage("Fehler beim Checkout");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900/80 bg-opacity-50 flex items-center justify-center z-20 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl mb-4 text-neutral-500">Kauf abschließen</h2>
        {errorMessage && <p className="mb-4 text-red-300">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <label
                htmlFor="street"
                className="block mb-1 font-medium text-neutral-400"
              >
                Straße
              </label>
              <input
                id="street"
                type="text"
                className="w-full border border-gray-300 rounded p-2  text-neutral-400"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Musterstraße"
              />
            </div>
            <div className="w-24">
              <label
                htmlFor="houseNumber"
                className="block mb-1 font-medium text-neutral-400"
              >
                Nr.
              </label>
              <input
                id="houseNumber"
                type="text"
                className="w-full border border-gray-300 rounded p-2 text-neutral-400"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                placeholder="12a"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-24">
              <label
                htmlFor="postalCode"
                className="block mb-1 font-medium text-neutral-400"
              >
                PLZ
              </label>
              <input
                id="postalCode"
                type="text"
                className="w-full border border-gray-300 rounded p-2  text-neutral-400"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="12345"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="city"
                className="block mb-1 font-medium text-neutral-400"
              >
                Stadt
              </label>
              <input
                id="city"
                type="text"
                className="w-full border border-gray-300 rounded p-2  text-neutral-400"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Musterstadt"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="paymentMethod"
              className="block mb-1 font-medium  text-neutral-400"
            >
              Bezahlmethode
            </label>
            <select
              id="paymentMethod"
              className="w-full border border-gray-300 rounded p-2  text-neutral-400"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="credit-card">Kreditkarte</option>
              <option value="paypal">PayPal</option>
              <option value="bank-transfer">Banküberweisung</option>
            </select>
          </div>
          <p className="text-neutral-400 mb-2">
            {cart.length > 0 &&
              `${cart.length} Artikel für ${cart
                .reduce((total, item) => total + item.price, 0)
                .toFixed(2)}€`}
          </p>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex-1"
            >
              Kaufen
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded flex-1"
            >
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PurchaseModal;
