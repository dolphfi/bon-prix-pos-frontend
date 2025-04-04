import React, { useState, useEffect } from "react";
import Sidebar from "../../../includes/Sidebar";
import Header from "../../../includes/Header";
import Footer from "../../../includes/Footer";
import { useProducts } from "../../../context/ProductContext";
import { toast } from "react-toastify";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([getProducts(), getCategories()]);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [getProducts, getCategories]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Retour à la première page lors d'un changement de filtre
  };

  const filteredProducts = products.filter((product) => {
    // Filtre par catégorie
    if (filters.category !== "all" && product.categoryId !== filters.category) {
      return false;
    }

    // Filtre par status
    if (filters.status !== "all") {
      const isActive = filters.status === "active";
      if (product.isActive !== isActive) {
        return false;
      }
    }

    // Filtre par recherche
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower) ||
        product.mainBarcode?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Calcul des indices pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Fonction pour changer de page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  const handleSubmit = async (productData, categoryData) => {
    try {
      if (categoryData) {
        await createCategory(categoryData);
        await getCategories(); // Rafraîchir les catégories
      } else {
        await createProduct(productData);
        await getProducts(); // Rafraîchir les produits
      }
      closeModal();
      toast.success(categoryData ? 'Catégorie créée avec succès' : 'Produit créé avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      // await loadData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

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
                      <th className="px-4 py-3">Discount</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {currentItems.map((product) => (
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
                          {product.category?.name || 'Non catégorisé'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {product.basePrice} HTG
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {product.hasVariants
                            ? product.variants?.reduce((total, variant) => total + (variant.stock || 0), 0) || 0
                            : product.trackBatches
                              ? product.batches?.reduce((total, batch) => total + (batch.quantity || 0), 0) || 0
                              : product.stock || 0
                          }
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {product.discount > 0 ? (
                            <div className="flex flex-col">
                              <span className="font-semibold text-green-600">{product.discount} HTG</span>
                              {product.discountExpiry && (
                                <span className="text-xs text-gray-500">
                                  Expire le: {new Date(product.discountExpiry).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500">Pas de réduction</span>
                          )}
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
              {/* Pagination */}
              <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                <span className="flex items-center col-span-3">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length}
                </span>
                <span className="col-span-2"></span>
                <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                  <nav aria-label="Table navigation">
                    <ul className="inline-flex items-center">
                      <li>
                        <button
                          className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                          aria-label="Previous"
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        >
                          <svg aria-hidden="true" className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, index) => (
                        <li key={index}>
                          <button
                            className={`px-3 py-1 rounded-md ${
                              currentPage === index + 1 ? "bg-purple-600 text-white" : ""
                            }`}
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                          aria-label="Next"
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        >
                          <svg className="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                            <path
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </span>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {/* Modal pour l'ajout/modification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-30">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start sm:items-center p-4 sm:p-4">
              <div className="relative w-full sm:w-4/5 md:w-3/4 lg:w-2/3 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <div className="border-b dark:border-gray-700 px-4 py-2 flex justify-between items-center">
                  <h2 className="text-base font-medium text-gray-700 dark:text-gray-300">
                    {modalType === "product" && (selectedProduct ? "Modifier" : "Nouveau") + " produit"}
                    {modalType === "variant" && "Nouvelle variante"}
                    {modalType === "batch" && "Nouveau lot"}
                    {modalType === "category" && "Nouvelle catégorie"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="inline-flex items-center justify-center w-8 h-8 text-gray-400 transition-colors duration-150 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>

                {/* Corps du formulaire */}
                <div className="px-4 py-5 sm:p-6">
                  {/* Formulaire de produit */}
                  {modalType === "product" && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData();

                      // Récupérer le fichier image
                      const imageFile = e.target.image.files[0];
                      if (!imageFile) {
                        toast.error('Une image est requise');
                        return;
                      }

                      // Ajouter les champs au FormData
                      formData.append('image', imageFile);
                      formData.append('name', e.target.name.value);
                      formData.append('sku', e.target.sku.value);
                      formData.append('description', e.target.description.value);
                      formData.append('basePrice', e.target.basePrice.value);
                      formData.append('stock', e.target.stock.value);
                      formData.append('categoryId', e.target.categoryId.value);
                      formData.append('minStockLevel', parseInt(e.target.minStockLevel.value) || 0);
                      const discountValue = parseFloat(e.target.discount?.value || '0');
                      formData.append('discount', discountValue || 0);
                      formData.append('discountExpiry', discountValue > 0 ? e.target.discountExpiry?.value || null : null);
                      formData.append('mainBarcode', e.target.mainBarcode.value || '');
                      formData.append('additionalBarcodes', JSON.stringify(e.target.additionalBarcodes?.value?.split(',').map(b => b.trim()) || []));
                      formData.append('specifications', e.target.specifications?.value || JSON.stringify({}));
                      formData.append('alertLevel', e.target.alertLevel?.value || 'MEDIUM');
                      formData.append('quantityPricing', JSON.stringify([]));
                      formData.append('tags', JSON.stringify(e.target.tags?.value?.split(',').map(t => t.trim()) || []));

                      handleSubmit(formData);
                    }}>
                      <div className="p-4">
                        {/* Informations de base */}
                        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Informations de base</h3>
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                          {/* Image */}
                          <div className="w-full sm:w-1/4">
                            <label className="block text-sm">
                              <span className="text-gray-700 dark:text-gray-400">Image du produit</span>
                              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-purple-500 dark:hover:border-purple-500 transition-colors cursor-pointer">
                                <div className="space-y-1 text-center">
                                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500">
                                      <span>Télécharger un fichier</span>
                                      <input
                                        id="file-upload"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        className="sr-only pr-1"
                                        required
                                      />
                                    </label>
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG jusqu'à 10MB</p>
                                </div>
                              </div>
                            </label>
                          </div>

                          {/* Nom */}
                          <div className="w-full sm:w-1/4">
                            <label className="block text-sm">
                              <span className="text-gray-700 dark:text-gray-400">Nom</span>
                              <input
                                type="text"
                                name="name"
                                defaultValue={selectedProduct?.name}
                                placeholder="Nom du produit"
                                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                                required
                              />
                            </label>
                          </div>

                          {/* SKU */}
                          <div className="w-full sm:w-1/4">
                            <label className="block text-sm">
                              <span className="text-gray-700 dark:text-gray-400">Référence interne (SKU)</span>
                              <span className="text-xs text-gray-500 ml-1">Code unique</span>
                              <input
                                type="text"
                                name="sku"
                                defaultValue={selectedProduct?.sku}
                                placeholder="Ex: CH-BLC-XL-001"
                                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                                required
                              />
                            </label>
                          </div>
                        </div>

                        {/* Prix et Stock */}
                        <div className="flex flex-col sm:flex-row gap-6 mt-4">
                          {/* Prix de base */}
                          <div className="w-full sm:w-1/4">
                            <label className="block text-sm">
                              <span className="text-gray-700 dark:text-gray-400">Prix de base</span>
                              <div className="relative">
                                <input
                                  type="number"
                                  name="basePrice"
                                  min="0"
                                  step="0.01"
                                  defaultValue={selectedProduct?.basePrice || 0}
                                  className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                                  required
                                />
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm">HTG</span>
                              </div>
                            </label>
                          </div>

                          {/* Stock initial */}
                          <div className="w-full sm:w-1/4">
                            <label className="block text-sm">
                              <span className="text-gray-700 dark:text-gray-400">Stock initial</span>
                              <input
                                type="number"
                                name="stock"
                                min="0"
                                defaultValue={selectedProduct?.stock || 0}
                                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                              />
                            </label>
                          </div>

                          {/* Stock minimum */}
                          <div className="w-full sm:w-1/4">
                            <label className="block text-sm">
                              <span className="text-gray-700 dark:text-gray-400">Stock minimum</span>
                              <input
                                type="number"
                                name="minStockLevel"
                                min="0"
                                defaultValue={selectedProduct?.minStockLevel || 0}
                                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                              />
                            </label>
                          </div>
                        </div>

                        {/* Remises et Codes-barres */}

                        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 mt-8">Remises et Codes-barres</h3>
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                          {/* Remise (%) */}
                          <div className="w-full sm:w-1/4">
                            <label className="block text-sm">
                              <span className="text-gray-700 dark:text-gray-400">Remise (%)</span>
                              <input
                                type="number"
                                name="discount"
                                min="0"
                                max="100"
                                step="0.01"
                                defaultValue={selectedProduct?.discount || 0}
                                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                              />
                            </label>
                          </div>

                          {/* Date d'expiration de la remise */}
                          <div className="w-full sm:w-1/4">
                            <label className="block text-sm">
                              <span className="text-gray-700 dark:text-gray-400">Date d'expiration de la remise</span>
                              <input
                                type="datetime-local"
                                name="discountExpiry"
                                defaultValue={selectedProduct?.discountExpiry}
                                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                              />
                            </label>
                          </div>

                          {/* Code-barres principal */}
                          <div className="w-full sm:w-1/4">
                            <label className="block text-sm">
                              <span className="text-gray-700 dark:text-gray-400">Code-barres principal</span>
                              <input
                                type="text"
                                name="mainBarcode"
                                defaultValue={selectedProduct?.mainBarcode}
                                placeholder="Ex: 123456789012"
                                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                              />
                            </label>
                          </div>
                        </div>

                        {/* Description et Options */}

                        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 mt-8">Description et Options</h3>
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                          {/* Description du produit */}
                          <div className="w-full sm:w-1/2">
                            <label className="block text-sm">
                              <span className="text-gray-700 dark:text-gray-400">Description du produit</span>
                              <textarea
                                name="description"
                                defaultValue={selectedProduct?.description}
                                rows="3"
                                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-textarea"
                                required
                              ></textarea>
                            </label>
                          </div>

                          {/* Catégorie */}
                          <div className="w-full sm:w-1/4">
                            <label className="block text-sm">
                              <span className="text-gray-700 dark:text-gray-400">Catégorie</span>
                              <select
                                name="categoryId"
                                defaultValue={selectedProduct?.categoryId}
                                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-select"
                              >
                                <option value="">Sélectionnez une catégorie</option>
                                {categories.map((cat) => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-col sm:flex-row gap-6 mt-8">
                          <div className="w-full sm:w-1/2">
                            <label className="block text-sm">
                              <span className="text-gray-700 dark:text-gray-400">Tags</span>
                              <span className="text-xs text-gray-500 ml-1">(séparés par des virgules)</span>
                              <input
                                type="text"
                                name="tags"
                                defaultValue={selectedProduct?.tags?.join(', ')}
                                placeholder="Ex: promo, nouveau, populaire"
                                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end space-x-3 mb-2">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
                      const formData = new FormData();
                      // Ajouter les autres champs
                      formData.append('name', e.target.name.value);
                      formData.append('price', e.target.price.value);
                      formData.append('stock', e.target.stock.value);

                      handleSubmit(formData);
                    }}>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <label className="block text-sm">
                            <span className="text-gray-700 dark:text-gray-400">Nom de la variante</span>
                            <input
                              type="text"
                              name="name"
                              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                              required
                            />
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm">
                            <span className="text-gray-700 dark:text-gray-400">Prix</span>
                            <input
                              type="number"
                              name="price"
                              step="0.01"
                              min="0"
                              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                              required
                            />
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm">
                            <span className="text-gray-700 dark:text-gray-400">Stock initial</span>
                            <input
                              type="number"
                              name="stock"
                              min="0"
                              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                              required
                            />
                          </label>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
                      const categoryData = {
                        name: e.target.name.value,
                        description: e.target.description.value
                      };

                      handleSubmit(null, categoryData);
                    }}>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <label className="block text-sm">
                            <span className="text-gray-700 dark:text-gray-400">Nom de la catégorie</span>
                            <input
                              type="text"
                              name="name"
                              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                              required
                            />
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm">
                            <span className="text-gray-700 dark:text-gray-400">Description</span>
                            <textarea
                              name="description"
                              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-textarea"
                              rows="3"
                              required
                            ></textarea>
                          </label>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Créer
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
