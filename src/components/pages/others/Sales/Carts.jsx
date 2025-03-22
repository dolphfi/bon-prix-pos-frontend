import React, { useState, useContext, useEffect } from "react";
import Header from "../../../includes/Header";
import Sidebar from "../../../includes/Sidebar";
import Footer from "../../../includes/Footer";
import Sales from "../../../context/SalesContext";
import { toast } from "react-toastify";
import { UrlProducts } from "../../../public/BaseUrls";

const Carts = () => {
  const isSideMenuOpen = true;
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateCartItemQuantity,
    selectedCustomer,
    setSelectedCustomer,
    appliedPromotions,
    applyPromotion,
    removePromotion,
    createSale,
    recalculateCart
  } = useContext(Sales);

  // États locaux
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showVariants, setShowVariants] = useState(false);

  // Calculs des totaux
  const { subtotal, total } = recalculateCart();

  // Recherche de produits
  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(`${UrlProducts}search?term=${searchTerm}`);
        if (!response.ok) throw new Error('Erreur lors de la recherche');
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors de la recherche des produits');
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Gestion de la sélection de produit
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    if (product.variants?.length > 0) {
      setShowVariants(true);
      setSelectedVariant(null);
    } else {
      handleAddToCart(product);
    }
  };

  // Gestion de la sélection de variante
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    if (variant.batches?.length > 0) {
      setSelectedBatch(null);
    } else {
      handleAddToCart(selectedProduct, variant);
    }
  };

  // Gestion de la sélection de lot
  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    handleAddToCart(selectedProduct, selectedVariant, batch);
  };

  // Ajout au panier
  const handleAddToCart = (product, variant = null, batch = null) => {
    if (quantity < 1) {
      toast.error('La quantité doit être supérieure à 0');
      return;
    }

    addToCart(product, variant, batch, quantity);
    toast.success('Produit ajouté au panier');
    
    // Reset selection
    setSelectedProduct(null);
    setSelectedVariant(null);
    setSelectedBatch(null);
    setQuantity(1);
    setSearchTerm('');
    setShowVariants(false);
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isSideMenuOpen ? "overflow-hidden" : ""}`}>
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
                          {product.price} XOF
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sélection de variante */}
                {showVariants && selectedProduct && (
                  <div className="mt-4">
                    <h5 className="mb-2 text-sm font-semibold">Variantes disponibles</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProduct.variants.map((variant) => (
                        <button
                          key={variant.id}
                          className={`p-2 text-sm rounded ${
                            selectedVariant?.id === variant.id
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700'
                          }`}
                          onClick={() => handleVariantSelect(variant)}
                        >
                          {variant.name} - {variant.price} XOF
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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
                    <span>{subtotal} XOF</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{total} XOF</span>
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
                      <th className="px-4 py-3">Variante</th>
                      <th className="px-4 py-3">Quantité</th>
                      <th className="px-4 py-3">Prix unitaire</th>
                      <th className="px-4 py-3">Remise</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {cart.map((item) => (
                      <tr key={item.id} className="text-gray-700 dark:text-gray-400">
                        <td className="px-4 py-3">{item.product.name}</td>
                        <td className="px-4 py-3">{item.variant?.name || '-'}</td>
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
                        <td className="px-4 py-3">{item.unitPrice} XOF</td>
                        <td className="px-4 py-3">{item.discountAmount} XOF</td>
                        <td className="px-4 py-3">{item.total} XOF</td>
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
                  <span className="font-bold">{subtotal} XOF</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-bold text-lg">{total} XOF</span>
                </div>
                <button
                  className="w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
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
                  disabled={loading || cart.length === 0}
                >
                  {loading ? "Traitement..." : "Finaliser la vente"}
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Carts;
