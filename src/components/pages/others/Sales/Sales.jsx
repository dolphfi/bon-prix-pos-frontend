import React, { useState, useContext, useEffect } from "react";
import Header from "../../../includes/Header";
import Sidebar from "../../../includes/Sidebar";
import Footer from "../../../includes/Footer";
import Sales from "../../../context/SalesContext";
import { toast } from "react-toastify";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";

const SalesHistory = () => {
  const isSideMenuOpen = true;
  const { getSales, printReceipt } = useContext(Sales);

  // États
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    minAmount: "",
    maxAmount: "",
    status: "all",
    searchTerm: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Chargement des ventes
  useEffect(() => {
    loadSales();
  }, [currentPage, filters]);

  const loadSales = async () => {
    try {
      setLoading(true);
      const response = await getSales({
        ...filters,
        page: currentPage,
        limit: 10
      });
      
      setSales(response.sales);
      setTotalPages(Math.ceil(response.total / 10));
    } catch (error) {
      toast.error("Erreur lors du chargement des ventes");
    } finally {
      setLoading(false);
    }
  };

  // Gestion des filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset à la première page
  };

  // Impression du reçu
  const handlePrintReceipt = async (saleId) => {
    try {
      await printReceipt(saleId);
      toast.success("Reçu généré avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'impression du reçu");
    }
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isSideMenuOpen ? "overflow-hidden" : ""}`}>
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />
        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto grid">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Historique des ventes
            </h2>

            {/* Filtres */}
            <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Date début</span>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Date fin</span>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Montant min</span>
                  <input
                    type="number"
                    name="minAmount"
                    value={filters.minAmount}
                    onChange={handleFilterChange}
                    placeholder="0"
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Montant max</span>
                  <input
                    type="number"
                    name="maxAmount"
                    value={filters.maxAmount}
                    onChange={handleFilterChange}
                    placeholder="999999"
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  />
                </label>
              </div>

              <div className="grid gap-6 mt-4 md:grid-cols-2">
                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Statut</span>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-select"
                  >
                    <option value="all">Tous</option>
                    <option value="completed">Complétée</option>
                    <option value="cancelled">Annulée</option>
                    <option value="pending">En attente</option>
                  </select>
                </label>

                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Recherche</span>
                  <input
                    type="text"
                    name="searchTerm"
                    value={filters.searchTerm}
                    onChange={handleFilterChange}
                    placeholder="Rechercher par client, produit..."
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  />
                </label>
              </div>
            </div>

            {/* Liste des ventes */}
            <div className="w-full overflow-hidden rounded-lg shadow-xs">
              <div className="w-full overflow-x-auto">
                <table className="w-full whitespace-no-wrap">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Articles</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {sales.map((sale) => (
                      <tr key={sale.id} className="text-gray-700 dark:text-gray-400">
                        <td className="px-4 py-3">{sale.id}</td>
                        <td className="px-4 py-3">
                          {format(new Date(sale.createdAt), 'Pp', { locale: fr })}
                        </td>
                        <td className="px-4 py-3">{sale.customer?.name || 'Client occasionnel'}</td>
                        <td className="px-4 py-3">{sale.items.length} articles</td>
                        <td className="px-4 py-3">{sale.total} XOF</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${
                            sale.status === 'completed'
                              ? 'text-green-700 bg-green-100 dark:text-green-100 dark:bg-green-700'
                              : sale.status === 'cancelled'
                              ? 'text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700'
                              : 'text-orange-700 bg-orange-100 dark:text-orange-100 dark:bg-orange-700'
                          }`}>
                            {sale.status === 'completed'
                              ? 'Complétée'
                              : sale.status === 'cancelled'
                              ? 'Annulée'
                              : 'En attente'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handlePrintReceipt(sale.id)}
                              className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                              aria-label="Print"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0v3H7V4h6zm0 8v4H7v-4h6z"></path>
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
                  Affichage de {sales.length} vente(s)
                </span>
                <span className="col-span-2"></span>
                <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                  <nav aria-label="Table navigation">
                    <ul className="inline-flex items-center">
                      <li>
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                          aria-label="Previous"
                        >
                          <svg className="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                            <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
                          </svg>
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, index) => (
                        <li key={index}>
                          <button
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple ${
                              currentPage === index + 1
                                ? 'text-white bg-purple-600'
                                : ''
                            }`}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                          aria-label="Next"
                        >
                          <svg className="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                            <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
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
    </div>
  );
};

export default SalesHistory;
