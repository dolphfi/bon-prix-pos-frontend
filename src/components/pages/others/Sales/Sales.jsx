import React, { useState, useEffect } from "react";
import Header from "../../../includes/Header";
import Sidebar from "../../../includes/Sidebar";
import Footer from "../../../includes/Footer";
import { useSales } from "../../../context/SalesContext";
import { toast } from "react-toastify";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";

const SalesHistory = () => {
  const isSideMenuOpen = true;
  const { getSales, printReceipt, finalizeSale, handleDownloadReceipt } = useSales();

  // États
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    status: "all",
    searchTerm: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentSale, setCurrentSale] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Chargement des ventes
  useEffect(() => {
    loadSales();
  }, [currentPage]);

  const handlePrintReceipt = async (saleId) => {
    try {
      await printReceipt(saleId);
      toast.success('Reçu généré avec succès');
    } catch (error) {
      console.error('Error printing receipt:', error);
      toast.error('Erreur lors de la génération du reçu');
    }
  };

  const loadSales = async () => {
    try {
      setLoading(true);
      const response = await getSales({
        page: currentPage,
        limit: 10
      });

      console.log('Response:', response);
      if (response?.data?.items) {
        setSales(response.data.items);
        setTotalPages(Math.ceil(response.data.total / 10));
      } else {
        setSales([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error loading sales:', error);
      toast.error("Erreur lors du chargement des ventes");
      setSales([]);
      setTotalPages(1);
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
    setCurrentPage(1);
  };

  // Pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFinalizeSale = async () => {
    try {
      setIsProcessing(true);
      const result = await finalizeSale(currentSale);
      
      console.log("Sale result:", result); // Debug log
      
      // Si l'impression a échoué et qu'on doit télécharger le reçu
      if (result.receipt?.shouldDownload) {
        toast.info('Aucune imprimante disponible. Téléchargement du reçu...');
        await handleDownloadReceipt(result.id);
      }
      
      resetCart();
      navigate('/sales');
    } catch (error) {
      console.error('Error finalizing sale:', error);
      toast.error('Erreur lors de la finalisation de la vente');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCart = () => {
    // Implement cart reset logic here
  };

  const navigate = () => {
    // Implement navigation logic here
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
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
              <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                <div>
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
                </div>
                <div>
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
                </div>
                <div>
                  <label className="block text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Montant min</span>
                    <input
                      type="number"
                      name="minAmount"
                      value={filters.minAmount}
                      onChange={handleFilterChange}
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Montant max</span>
                    <input
                      type="number"
                      name="maxAmount"
                      value={filters.maxAmount}
                      onChange={handleFilterChange}
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    />
                  </label>
                </div>
              </div>
              <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label className="block text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Statut</span>
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                    >
                      <option value="all">Tous</option>
                      <option value="completed">Complétée</option>
                      <option value="pending">En attente</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label className="block text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Recherche</span>
                    <input
                      type="text"
                      name="searchTerm"
                      value={filters.searchTerm}
                      onChange={handleFilterChange}
                      placeholder="Numéro de facture, client..."
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Liste des ventes */}
            <div className="w-full overflow-hidden rounded-lg shadow-xs">
              <div className="w-full overflow-x-auto">
                <table className="w-full whitespace-no-wrap">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                      <th className="px-4 py-3">N° Facture</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-3 text-center">
                          Chargement...
                        </td>
                      </tr>
                    ) : sales.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-3 text-center">
                          Aucune vente trouvée
                        </td>
                      </tr>
                    ) : (
                      sales.map((sale) => (
                        <tr key={sale.id} className="text-gray-700 dark:text-gray-400">
                          <td className="px-4 py-3">
                            <div className="flex items-center text-sm">
                              {sale.invoiceNumber}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {format(new Date(sale.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {sale.customer ? `${sale.customer.firstName} ${sale.customer.lastName}` : 'Client anonyme'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {sale.total.toLocaleString('fr-FR', { style: 'currency', currency: sale.currency || 'XOF' })}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 font-semibold leading-tight rounded-full ${sale.status === 'COMPLETED'
                                  ? 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100'
                                  : sale.status === 'PENDING'
                                    ? 'text-orange-700 bg-orange-100 dark:text-white dark:bg-orange-600'
                                    : 'text-red-700 bg-red-100 dark:text-white dark:bg-red-600'
                                }`}
                            >
                              {sale.status === 'COMPLETED'
                                ? 'Complétée'
                                : sale.status === 'PENDING'
                                  ? 'En attente'
                                  : 'Annulée'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-4 text-sm">
                              <button
                                onClick={() => handlePrintReceipt(sale.id)}
                                className="flex items-center justify-center px-3 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                              >
                                <i className="fas fa-print mr-2"></i>
                                Imprimer reçu
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                <span className="flex items-center col-span-3">
                  Page {currentPage} sur {totalPages}
                </span>
                <span className="col-span-2"></span>
                <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                  <nav aria-label="Table navigation">
                    <ul className="inline-flex items-center">
                      <li>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                          aria-label="Previous"
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li key={i}>
                          <button
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple ${currentPage === i + 1
                                ? 'text-white transition-colors duration-150 bg-purple-600 border border-r-0 border-purple-600'
                                : ''
                              }`}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                          aria-label="Next"
                        >
                          <i className="fas fa-chevron-right"></i>
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
