import React, { useState, useEffect } from "react";
import Header from "../../../includes/Header";
import Sidebar from "../../../includes/Sidebar";
import Footer from "../../../includes/Footer";
import { useSales } from "../../../context/SalesContext";
import { toast } from "react-toastify";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";

const ProformaInvoices = () => {
  const { getProformaInvoices, deleteProforma, convertToSale } = useSales();

  // États
  const [proformas, setProformas] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    status: "all",
    searchTerm: "",
  });

  // Chargement des factures proforma
  useEffect(() => {
    loadProformas();
  }, [currentPage, filters]);

  const loadProformas = async () => {
    try {
      setLoading(true);
      const response = await getProformaInvoices({
        ...filters,
        page: currentPage,
        limit: itemsPerPage
      });
      setProformas(response.proformas || []);
      setTotalCount(response.total || 0);
    } catch (error) {
      toast.error("Erreur lors du chargement des factures proforma");
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

  // Convertir en vente
  const handleConvertToSale = async (proformaId) => {
    try {
      await convertToSale(proformaId);
      toast.success("Facture proforma convertie en vente");
      loadProformas();
    } catch (error) {
      toast.error("Erreur lors de la conversion");
    }
  };

  // Supprimer une facture proforma
  const handleDelete = async (proformaId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette facture proforma ?")) {
      return;
    }

    try {
      await deleteProforma(proformaId);
      toast.success("Facture proforma supprimée");
      loadProformas();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Calcul de la pagination
  const currentItems = proformas || [];
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${true ? "overflow-hidden" : ""}`}>
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />
        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto grid">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Factures Proforma
            </h2>

            {/* Filtres */}
            <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="grid gap-6 md:grid-cols-4">
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
                  <span className="text-gray-700 dark:text-gray-400">Status</span>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-select"
                  >
                    <option value="all">Tous les status</option>
                    <option value="pending">En attente</option>
                    <option value="converted">Convertie</option>
                    <option value="expired">Expirée</option>
                  </select>
                </label>

                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Recherche</span>
                  <input
                    type="text"
                    name="searchTerm"
                    value={filters.searchTerm}
                    onChange={handleFilterChange}
                    placeholder="Numéro de facture..."
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  />
                </label>
              </div>
            </div>

            {/* Liste des factures proforma */}
            <div className="w-full overflow-hidden rounded-lg shadow-xs">
              <div className="w-full overflow-x-auto">
                <table className="w-full whitespace-no-wrap">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                      <th className="px-4 py-3">N° Facture</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date d'expiration</th>
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
                    ) : currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-3 text-center">
                          Aucune facture proforma trouvée
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((proforma) => (
                        <tr key={proforma.id} className="text-gray-700 dark:text-gray-400">
                          <td className="px-4 py-3">
                            <div className="flex items-center text-sm">
                              <div>
                                <p className="font-semibold">{proforma.invoiceNumber}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {proforma.customer ? proforma.customer.name : "Client anonyme"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {proforma.total.toLocaleString()} HTG
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <span className={`px-2 py-1 font-semibold leading-tight rounded-full 
                              ${proforma.status === 'PENDING' ? 'text-yellow-700 bg-yellow-100 dark:bg-yellow-700 dark:text-yellow-100' : ''}
                              ${proforma.status === 'CONVERTED' ? 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100' : ''}
                              ${proforma.status === 'EXPIRED' ? 'text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100' : ''}
                            `}>
                              {proforma.status === 'PENDING' ? 'En attente' : ''}
                              {proforma.status === 'CONVERTED' ? 'Convertie' : ''}
                              {proforma.status === 'EXPIRED' ? 'Expirée' : ''}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {format(new Date(proforma.expiryDate), 'dd/MM/yyyy')}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-4 text-sm">
                              {proforma.status === 'PENDING' && (
                                <button
                                  onClick={() => handleConvertToSale(proforma.id)}
                                  className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                                  aria-label="Convert"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(proforma.id)}
                                className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                                aria-label="Delete"
                              >
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
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
                  Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}
                </span>
                <span className="col-span-2"></span>
                <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                  <nav aria-label="Table navigation">
                    <ul className="inline-flex items-center">
                      <li>
                        <button
                          className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                          aria-label="Previous"
                          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        >
                          <svg aria-hidden="true" className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                              fillRule="evenodd"
                            />
                          </svg>
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, index) => (
                        <li key={index}>
                          <button
                            className={`px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple ${
                              currentPage === index + 1
                                ? "text-white bg-purple-600"
                                : ""
                            }`}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                          aria-label="Next"
                          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                        >
                          <svg className="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                            <path
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                              fillRule="evenodd"
                            />
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

export default ProformaInvoices;
