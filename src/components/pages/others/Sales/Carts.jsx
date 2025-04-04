import React, { useState, useEffect } from "react";
import Header from "../../../includes/Header";
import Sidebar from "../../../includes/Sidebar";
import Footer from "../../../includes/Footer";
import { useSales } from "../../../context/SalesContext";
import { toast } from "react-toastify";
import { format, addDays } from 'date-fns';

const Carts = () => {
  const {
    cart,
    cartTotals,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    createSale,
    savePendingSale,
    createProforma,
    appliedPromotions,
    removePromotion,
    searchProducts
  } = useSales();

  // États locaux
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showProformaModal, setShowProformaModal] = useState(false);
  const [expiryDate, setExpiryDate] = useState(format(addDays(new Date(), 30), 'yyyy-MM-dd'));

  // Utiliser les totaux du panier depuis le contexte
  const { subtotal, total } = cartTotals;

  // Recherche de produits
  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        const results = await searchProducts(searchTerm);
        setSearchResults(results);
      } catch (error) {
        toast.error(error.message);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchProducts]);

  // Gestion de la sélection de produit
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    handleAddToCart(product);
  };

  // Ajout au panier
  const handleAddToCart = (product) => {
    if (quantity < 1) {
      toast.error('La quantité doit être supérieure à 0');
      return;
    }

    addToCart(product, quantity);
    toast.success('Produit ajouté au panier');

    // Reset selection
    setSelectedProduct(null);
    setQuantity(1);
    setSearchTerm('');
  };

  // Sauvegarder en tant que vente en attente
  const handleSavePending = async () => {
    if (cart.length === 0) {
      toast.error("Le panier est vide");
      return;
    }

    try {
      await savePendingSale();
      toast.success("Vente sauvegardée en attente");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Créer une facture proforma
  const handleCreateProforma = async () => {
    if (cart.length === 0) {
      toast.error("Le panier est vide");
      return;
    }

    try {
      await createProforma(expiryDate);
      setShowProformaModal(false);
      toast.success("Facture proforma créée");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900`}>
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />
        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto grid">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Nouvelle Vente
            </h2>

            {/* Section Recherche et Sélection */}
            <div className="grid gap-6 mb-8 md:grid-cols-2">
              {/* Recherche de produits */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <h4 className="mb-4 font-semibold text-gray-600 dark:text-gray-300">
                  Rechercher un produit
                </h4>
                <div className="relative mb-4">
                  <input
                    type="text"
                    className="w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
                    placeholder="Nom du produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Résultats de recherche */}
                <div className="mt-4 max-h-60 overflow-y-auto">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded"
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="flex justify-between items-center">
                        <span>{product.name}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {product.basePrice} HTG
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quantité */}
                {selectedProduct && (
                  <div className="mt-4">
                    <label className="block text-sm">
                      <span className="text-gray-700 dark:text-gray-400">Quantité</span>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Panier */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <h4 className="mb-4 font-semibold text-gray-600 dark:text-gray-300">
                  Résumé du panier
                </h4>
                <div className="text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between mb-2">
                    <span>Nombre d'articles:</span>
                    <span>{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Sous-total:</span>
                    <span>{subtotal} HTG</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{total} HTG</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des articles */}
            <div className="w-full overflow-hidden rounded-lg shadow-xs">
              <div className="w-full overflow-x-auto">
                <table className="w-full whitespace-no-wrap">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                      <th className="px-4 py-3">Produit</th>
                      <th className="px-4 py-3">Quantité</th>
                      <th className="px-4 py-3">Prix unitaire</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {cart.map((item) => (
                      <tr key={item.id} className="text-gray-700 dark:text-gray-400">
                        <td className="px-4 py-3">{item.product.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3">{item.unitPrice} HTG</td>
                        <td className="px-4 py-3">{item.total} HTG</td>
                        <td className="px-4 py-3">
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions du panier */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleSavePending}
                  className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                >
                  Sauvegarder en attente
                </button>
                <button
                  onClick={() => setShowProformaModal(true)}
                  className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                >
                  Créer Proforma
                </button>
              </div>
              <button
                onClick={async () => {
                  try {
                    setLoading(true);
                    const result = await createSale();
                    if (result) {
                      toast.success("Vente effectuée avec succès!");
                    }
                  } catch (error) {
                    toast.error("Erreur lors de la création de la vente");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green"
                disabled={loading || cart.length === 0}
              >
                {loading ? "Traitement..." : "Finaliser la vente"}
              </button>
            </div>

            {/* Totaux et Actions */}
            <div className="grid gap-6 mt-8 md:grid-cols-2">
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <h4 className="mb-4 font-semibold text-gray-600 dark:text-gray-300">
                  Promotions appliquées
                </h4>
                {appliedPromotions.map((promo) => (
                  <div key={promo.id} className="flex justify-between items-center mb-2">
                    <span>{promo.name}</span>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => removePromotion(promo.id)}
                    >
                      Retirer
                    </button>
                  </div>
                ))}
              </div>

              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600 dark:text-gray-400">Sous-total:</span>
                  <span className="font-bold">{subtotal} HTG</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-bold text-lg">{total} HTG</span>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {/* Modal Proforma */}
      {showProformaModal && (
        <div className="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center">
          <div className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl">
            <header className="flex justify-between">
              <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                Créer une facture proforma
              </h2>
              <button
                onClick={() => setShowProformaModal(false)}
                className="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover:text-gray-700"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </header>
            <div className="mt-4 mb-6">
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400">
                  Date d'expiration
                </span>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                />
              </label>
            </div>
            <footer className="flex flex-col items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-4 sm:space-y-0 sm:space-x-6 sm:flex-row bg-gray-50 dark:bg-gray-800">
              <button
                onClick={() => setShowProformaModal(false)}
                className="w-full px-5 py-3 text-sm font-medium leading-5 text-gray-700 transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 sm:px-4 sm:py-2 sm:w-auto active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateProforma}
                className="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              >
                Créer
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carts;
