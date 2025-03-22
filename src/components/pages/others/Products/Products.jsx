import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../../includes/Sidebar";
import Header from "../../../includes/Header";
import Footer from "../../../includes/Footer";
import { useProducts } from "../../../context/ProductContext";

const ProductsManager = () => {
  const {
    products,
    categories,
    getProducts,
    getCategories,
    deleteProduct,
    createProduct,
    updateProduct,
    addVariant,
    addBatch,
    createCategory,
  } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("product"); 
  const [filters, setFilters] = useState({
    category: "all",
    searchTerm: "",
    status: "all",
  });

  const loadData = useCallback(async () => {
    try {
      await Promise.all([getProducts(), getCategories()]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, [getProducts, getCategories]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (type, product = null) => {
    setModalType(type);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (formData) => {
    try {
      switch (modalType) {
        case "product":
          if (selectedProduct) {
            await updateProduct(selectedProduct.id, formData);
          } else {
            await createProduct(formData);
          }
          break;
        case "variant":
          await addVariant(selectedProduct.id, formData);
          break;
        case "batch":
          await addBatch(selectedProduct.id, formData.variantId, formData);
          break;
        case "category":
          await createCategory(formData);
          break;
        default:
          break;
      }
      closeModal();
      await loadData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      await loadData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
  );

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${true ? "overflow-hidden" : ""}`}>
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />
        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto grid">
            <div className="flex justify-between items-center my-6">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Gestion des produits
              </h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => openModal("category")}
                  className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                >
                  Nouvelle catégorie
                </button>
                <button
                  onClick={() => openModal("product")}
                  className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                >
                  Nouveau produit
                </button>
              </div>
            </div>

            {/* Filtres */}
            <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Catégorie</span>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-select"
                  >
                    <option value="all">Toutes les catégories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Recherche</span>
                  <input
                    type="text"
                    name="searchTerm"
                    value={filters.searchTerm}
                    onChange={handleFilterChange}
                    placeholder="Nom du produit..."
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Status</span>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-select"
                  >
                    <option value="all">Tous les status</option>
                    <option value="active">Actifs</option>
                    <option value="inactive">Inactifs</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Liste des produits */}
            <div className="w-full overflow-hidden rounded-lg shadow-xs">
              <div className="w-full overflow-x-auto">
                <table className="w-full whitespace-no-wrap">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                      <th className="px-4 py-3">Produit</th>
                      <th className="px-4 py-3">Catégorie</th>
                      <th className="px-4 py-3">Prix</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Variantes</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="text-gray-700 dark:text-gray-400">
                        <td className="px-4 py-3">
                          <div className="flex items-center text-sm">
                            <div>
                              <p className="font-semibold">{product.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {product.reference}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {product.category?.name}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {product.price} XOF
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {product.variants?.reduce((total, v) => total + v.stock, 0) || 0}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {product.variants?.length || 0} variante(s)
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-4 text-sm">
                            <button
                              onClick={() => openModal("variant", product)}
                              className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                              aria-label="Variant"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => openModal("product", product)}
                              className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                              aria-label="Edit"
                            >
                              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                              aria-label="Delete"
                            >
                              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {/* Modal pour l'ajout/modification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center">
          <div className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl">
            <header className="flex justify-between">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                {modalType === "product" && (selectedProduct ? "Modifier" : "Nouveau") + " produit"}
                {modalType === "variant" && "Nouvelle variante"}
                {modalType === "batch" && "Nouveau lot"}
                {modalType === "category" && "Nouvelle catégorie"}
              </h2>
              <button
                onClick={closeModal}
                className="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover: hover:text-gray-700"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </header>

            {/* Formulaire dynamique selon le type */}
            <div className="mt-4">
              {/* Formulaire de produit */}
              {modalType === "product" && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleSubmit({
                    name: formData.get("name"),
                    reference: formData.get("reference"),
                    description: formData.get("description"),
                    price: parseFloat(formData.get("price")),
                    categoryId: formData.get("categoryId"),
                  });
                }}>
                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Nom</span>
                    <input
                      name="name"
                      defaultValue={selectedProduct?.name}
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    />
                  </label>

                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Référence</span>
                    <input
                      name="reference"
                      defaultValue={selectedProduct?.reference}
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    />
                  </label>

                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Description</span>
                    <textarea
                      name="description"
                      defaultValue={selectedProduct?.description}
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-textarea"
                      rows="3"
                    ></textarea>
                  </label>

                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Prix</span>
                    <input
                      type="number"
                      name="price"
                      defaultValue={selectedProduct?.price}
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    />
                  </label>

                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Catégorie</span>
                    <select
                      name="categoryId"
                      defaultValue={selectedProduct?.categoryId}
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-select"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                    >
                      {selectedProduct ? "Mettre à jour" : "Créer"}
                    </button>
                  </div>
                </form>
              )}

              {/* Formulaire de variante */}
              {modalType === "variant" && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleSubmit({
                    name: formData.get("name"),
                    price: parseFloat(formData.get("price")),
                    stock: parseInt(formData.get("stock")),
                  });
                }}>
                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Nom de la variante</span>
                    <input
                      name="name"
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    />
                  </label>

                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Prix</span>
                    <input
                      type="number"
                      name="price"
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    />
                  </label>

                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Stock initial</span>
                    <input
                      type="number"
                      name="stock"
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    />
                  </label>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                    >
                      Ajouter
                    </button>
                  </div>
                </form>
              )}

              {/* Formulaire de catégorie */}
              {modalType === "category" && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleSubmit({
                    name: formData.get("name"),
                    description: formData.get("description"),
                  });
                }}>
                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Nom de la catégorie</span>
                    <input
                      name="name"
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    />
                  </label>

                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Description</span>
                    <textarea
                      name="description"
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-textarea"
                      rows="3"
                    ></textarea>
                  </label>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                    >
                      Créer
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
