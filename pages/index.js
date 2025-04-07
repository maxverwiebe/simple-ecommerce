import { useEffect, useState } from "react";
import CartModal from "../components/cartModal";
import ProductModal from "../components/productModal";
import PurchaseModal from "../components/purchaseModal";
import SearchBar from "../components/searchBar";
import ProductCard from "../components/productCard";
import { ToastContainer, useToasts } from "../components/toastSystem";
import Image from "next/image";

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
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
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartModal, setCartModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const { toasts, addToast, removeToast } = useToasts();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        addToast("Fehler beim Laden der Produkte");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const randomIndex = Math.floor(Math.random() * products.length);
      setFeaturedProduct(products[randomIndex]);
    }
  }, [products]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    addToast(`${product.title} wurde zum Warenkorb hinzugefügt.`);
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
      addToast("Ihr Warenkorb ist leer!");
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
        addToast("Error");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 flex items-center justify-between shadow-lg">
        <h1 className="text-3xl text-white font-bold flex items-center">
          <span className="mr-2 transform hover:scale-110 transition-transform duration-200">
            🛒
          </span>
          <span className="border-b-2 border-white pb-1">
            Simple E-Commerce
          </span>
        </h1>
        <div className="hidden md:block max-w-md ml-6 flex-1">
          <SearchBar onClick={onSearchClick} />
        </div>
        <div className="hidden md:block">
          <button
            onClick={() => setCartModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-5 rounded-lg font-medium shadow-md transition duration-200 transform hover:scale-105"
          >
            <div className="flex items-center">
              <Image
                src="/shopping-cart-xxl.png"
                alt="Warenkorb"
                width={28}
                height={28}
                className="filter drop-shadow-sm"
              />
              <span className="ml-2">Warenkorb ({cart.length})</span>
            </div>
          </button>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="text-white focus:outline-none bg-blue-600 p-2 rounded-md"
          >
            ☰
          </button>
        </div>
      </header>

      {navOpen && (
        <div className="md:hidden p-4 bg-blue-500 shadow-inner animate-fadeIn">
          <SearchBar onClick={onSearchClick} />
        </div>
      )}

      <main className="p-6 flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader border-t-4 border-b-4 border-blue-600 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        ) : (
          <>
            {featuredProduct && (
              <div className="mb-8">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-md shadow-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Dies ist ein Demo-Shop für Bildungszwecke. Keine realen
                        Produkte werden verkauft. Die Daten sind von
                        https://fakestoreapi.com/!
                      </p>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-700 border-b border-gray-200 pb-2">
                  Featured Produkt
                </h2>
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="md:flex">
                    <div className="w-full md:w-1/3 bg-gray-50 p-4 flex items-center justify-center">
                      <Image
                        src={featuredProduct.image}
                        alt={featuredProduct.title}
                        width={300}
                        height={300}
                        className="object-contain rounded-md transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="w-full md:w-2/3 p-6 md:p-8">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {featuredProduct.title}
                      </h3>
                      <p className="text-gray-600 mt-3 leading-relaxed">
                        {featuredProduct.description}
                      </p>
                      <div className="mt-6 flex flex-wrap items-center">
                        <span className="text-xl font-bold text-blue-700 bg-blue-50 py-1 px-3 rounded-full">
                          € {featuredProduct.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => addToCart(featuredProduct)}
                          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-lg transition-colors duration-200 shadow-md flex items-center"
                        >
                          <span className="mr-2">+</span> In den Warenkorb
                        </button>
                        <button
                          onClick={() => showDetails(featuredProduct)}
                          className="ml-4 mt-2 md:mt-0 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-5 rounded-lg transition-colors duration-200"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-700 border-b border-gray-200 pb-2">
                Weitere Produkte
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onShowDetails={showDetails}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="p-8 bg-neutral-200 text-center text-neutral-500 text-sm mt-auto">
        <div className="max-w-4xl mx-auto">
          Created for "E-Commerce" course at Kiel University. By Ahad Iqbal &
          Maximilian Verwiebe
        </div>
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

      {successModal && (
        <Toast
          message={successMessage}
          onClose={() => setSuccessModal(false)}
        />
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="md:hidden">
        <button
          onClick={() => setCartModal(true)}
          className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50 focus:outline-none"
          aria-label="Warenkorb öffnen"
        >
          <Image
            src="/shopping-cart-xxl.png"
            alt="Warenkorb"
            width={35}
            height={35}
          />
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-xs text-white w-5 h-5 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
