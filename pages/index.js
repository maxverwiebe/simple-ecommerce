import { useEffect, useState } from "react";

import CartModal from "../components/cartModal";
import ProductModal from "../components/productModal";
import PurchaseModal from "../components/purchaseModal";
import SearchBar from "../components/searchBar";

function Toast({ message, onClose }) {
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
    fetch("/api/product/*")
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
    setToastMessage(`${product.name} wurde zum Warenkorb hinzugefügt.`);
  };

  const removeFromCart = (index) => {
    setCart((prev) => {
      const newCart = [...prev];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  const showDetails = (product) => {
    fetch(`/api/product/${product.id}?details=1`)
      .then((res) => res.json())
      .then((data) => {
        setActiveProduct(data);
      })
      .catch(() => {
        setToastMessage("Error");
      });
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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 p-4 flex">
        <h1 className="text-2xl text-white mt-1">Simple E-Commerce</h1>
        <div className="ml-5">
          <SearchBar onClick={onSearchClick}></SearchBar>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => setCartModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            Warenkorb anzeigen ({cart.length})
          </button>
        </div>
      </header>
      <main className="p-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="loader border-t-4 border-blue-600 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p>{product.description}</p>
                <p className="mt-2 font-semibold">
                  € {product.price.toFixed(2)}
                </p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => showDetails(product)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                  >
                    In den Warenkorb
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="p-4 bg-gray-200 text-center">
        <p>test</p>
      </footer>

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
    </div>
  );
}
