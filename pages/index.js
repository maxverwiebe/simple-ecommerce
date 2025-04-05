import { useEffect, useState } from "react";
import CartModal from "../components/cartModal";
import ProductModal from "../components/productModal";
import PurchaseModal from "../components/purchaseModal";
import SearchBar from "../components/searchBar";

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // 2 Sekunden

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50">
      {message}
      <button
        onClick={onClose}
        aria-label="Schließen"
        className="ml-2 text-white font-bold"
      >
        ×
      </button>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartModal, setCartModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);

  // Produkte vom Backend laden
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setToastMessage("Fehler beim Laden der Produkte");
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    setToastMessage(`${product.title} wurde zum Warenkorb hinzugefügt.`);
  };

  const removeFromCart = (index) => {
    setCart((prev) => {
      const newCart = [...prev];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  const showDetails = (product) => {
    setActiveProduct(product);
  };

  const openPurchaseModal = () => {
    if (cart.length === 0) {
      setToastMessage("Ihr Warenkorb ist leer!");
      return;
    }
    setPurchaseModalVisible(true);
  };

  const onSearchClick = (id) => {
    fetch(`/api/product/${id}?details=1`)
      .then((res) => res.json())
      .then((data) => {
        setActiveProduct(data);
      })
      .catch(() => {
        setToastMessage("Error");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 p-6 flex items-center shadow-md">
        <h1 className="text-3xl text-white font-semibold">🛒 Simple E-Commerce</h1>
        <div className="ml-6 flex-1 max-w-md">
          <SearchBar onClick={onSearchClick} />
        </div>
        <div className="ml-auto">
          <button
            onClick={() => setCartModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-5 rounded-lg font-medium shadow transition duration-150"
          >
            Warenkorb ({cart.length})
          </button>
        </div>
      </header>

      <main className="p-6 flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader border-t-4 border-blue-600 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition duration-200 flex flex-col justify-between h-[320px]"
              >
                <h3 className="text-xl font-semibold text-gray-800">{product.title}</h3>
                <p className="text-neutral-500 mt-2">
                  {product.description.length > 120
                    ? product.description.slice(0, product.description.lastIndexOf(" ", 120)) + "..."
                    : product.description}
                </p>
                <p className="mt-4 text-lg font-bold text-blue-700">
                  € {product.price.toFixed(2)}
                </p>
                <div className="mt-5 flex justify-between gap-2">
                  <button
                    onClick={() => showDetails(product)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded w-full h-10 text-sm"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full h-10 text-sm"
                  >
                    In den Warenkorb
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="p-6 bg-gray-200 text-center text-gray-600 text-sm mt-auto">
        © {new Date().getFullYear()} Simple E-Commerce.
      </footer>

      {/* Modals */}
      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {cartModal && (
        <CartModal
          cart={cart}
          onClose={() => setCartModal(false)}
          onCheckout={openPurchaseModal}
          onRemoveItem={removeFromCart}
        />
      )}

      {purchaseModalVisible && (
        <PurchaseModal
          cart={cart}
          onClose={() => setPurchaseModalVisible(false)}
          onCheckoutSuccess={(message) => {
            setCart([]);
            setPurchaseModalVisible(false);
            setSuccessMessage(message);
            setSuccessModal(true);
          }}
        />
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
      {successModal && (
        <Toast
          message={successMessage}
          onClose={() => setSuccessModal(false)}
        />
      )}
    </div>
  );
}
