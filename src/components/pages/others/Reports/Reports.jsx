import React, { useState, useEffect, useContext, useCallback } from "react";
import Sidebar from "../../../includes/Sidebar";
import Header from "../../../includes/Header";
import Footer from "../../../includes/Footer";
import Reports from "../../../context/ReportContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import './Reports.css';
import { useDashboard } from '../../../context/DashboardContext';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportsManager = () => {
  const {
    loading: reportLoading,
    dashboardData,
    salesReport,
    productReport,
    getDashboardData,
    getSalesReport,
    getProductReport,
    exportToCSV,
  } = useContext(Reports);

  const { salesTrends, topProducts, stockAlerts, revenueStats, getSalesTrends, getTopProducts, getStockAlerts, getRevenueStats } = useDashboard();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [period, setPeriod] = useState("today");
  const [filters, setFilters] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    minAmount: "",
    maxAmount: "",
    status: "all",
  });

  const loadData = useCallback(async () => {
    try {
      if (activeTab === "dashboard") {
        await getDashboardData(period);
      } else if (activeTab === "sales") {
        await getSalesReport(filters);
      } else if (activeTab === "products") {
        await getProductReport(filters);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, [activeTab, period, filters, getDashboardData, getSalesReport, getProductReport]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          getSalesTrends(),
          getTopProducts(),
          getStockAlerts(),
          getRevenueStats(),
          loadData()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    loadDashboardData();
  }, [getSalesTrends, getTopProducts, getStockAlerts, getRevenueStats, loadData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExport = async (type) => {
    try {
      await exportToCSV(type, filters);
    } catch (error) {
      console.error("Erreur d'export:", error);
    }
  };

  const renderSalesTrendsChart = () => {
    if (!salesTrends) return null;

    const data = {
      labels: salesTrends.map(item => item.date),
      datasets: [{
        label: 'Ventes',
        data: salesTrends.map(item => item.amount),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };

    return (
      <div className="chart-container">
        <h3>Tendances des ventes</h3>
        <Line data={data} options={{ responsive: true }} />
      </div>
    );
  };

  const renderTopProductsChart = () => {
    if (!topProducts) return null;

    const data = {
      labels: topProducts.map(product => product.name),
      datasets: [{
        label: 'Ventes',
        data: topProducts.map(product => product.sales),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ]
      }]
    };

    return (
      <div className="chart-container">
        <h3>Meilleurs produits</h3>
        <Bar data={data} options={{ responsive: true }} />
      </div>
    );
  };

  const renderStockAlerts = () => {
    if (!stockAlerts) return null;

    return (
      <div className="stock-alerts">
        <h3>Alertes de stock</h3>
        <div className="alert-list">
          {stockAlerts.map(alert => (
            <div key={alert.id} className="alert-item">
              <span className="product-name">{alert.productName}</span>
              <span className="stock-level">Stock: {alert.currentStock}</span>
              <span className={`status ${alert.status}`}>{alert.status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRevenueStats = () => {
    if (!revenueStats) return null;

    const data = {
      labels: ['Ventes', 'Coûts', 'Profit'],
      datasets: [{
        data: [revenueStats.sales, revenueStats.costs, revenueStats.profit],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(75, 192, 192, 0.5)'
        ]
      }]
    };

    return (
      <div className="chart-container">
        <h3>Statistiques de revenus</h3>
        <Pie data={data} options={{ responsive: true }} />
      </div>
    );
  };

  return (
    <div className="reports-container">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />
        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto grid">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Rapports
            </h2>

            {/* Onglets */}
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                <li className="mr-2">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`inline-block p-4 rounded-t-lg ${activeTab === "dashboard"
                      ? "text-purple-600 border-b-2 border-purple-600 active"
                      : "hover:text-gray-600 hover:border-gray-300"
                      }`}
                  >
                    Tableau de bord
                  </button>
                </li>
                <li className="mr-2">
                  <button
                    onClick={() => setActiveTab("sales")}
                    className={`inline-block p-4 rounded-t-lg ${activeTab === "sales"
                      ? "text-purple-600 border-b-2 border-purple-600 active"
                      : "hover:text-gray-600 hover:border-gray-300"
                      }`}
                  >
                    Ventes
                  </button>
                </li>
                <li className="mr-2">
                  <button
                    onClick={() => setActiveTab("products")}
                    className={`inline-block p-4 rounded-t-lg ${activeTab === "products"
                      ? "text-purple-600 border-b-2 border-purple-600 active"
                      : "hover:text-gray-600 hover:border-gray-300"
                      }`}
                  >
                    Produits
                  </button>
                </li>
              </ul>
            </div>

            {/* Filtres */}
            <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {activeTab !== "dashboard" && (
                  <>
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
                      <span className="text-gray-700 dark:text-gray-400">Montant minimum</span>
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
                      <span className="text-gray-700 dark:text-gray-400">Montant maximum</span>
                      <input
                        type="number"
                        name="maxAmount"
                        value={filters.maxAmount}
                        onChange={handleFilterChange}
                        placeholder="999999"
                        className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                      />
                    </label>
                  </>
                )}

                {activeTab === "dashboard" && (
                  <label className="block text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Période</span>
                    <select
                      name="period"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-select"
                    >
                      <option value="today">Aujourd'hui</option>
                      <option value="week">Cette semaine</option>
                      <option value="month">Ce mois</option>
                      <option value="year">Cette année</option>
                    </select>
                  </label>
                )}
              </div>

              {activeTab !== "dashboard" && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleExport(activeTab)}
                    className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                  >
                    Exporter en CSV
                  </button>
                </div>
              )}
            </div>

            {/* Contenu des onglets */}
            {activeTab === "dashboard" && (
              <div className="dashboard-grid">
                {renderSalesTrendsChart()}
                {renderTopProductsChart()}
                {renderStockAlerts()}
                {renderRevenueStats()}
              </div>
            )}

            {activeTab === "sales" && salesReport && (
              <div className="w-full overflow-hidden rounded-lg shadow-xs">
                <div className="w-full overflow-x-auto">
                  <table className="w-full whitespace-no-wrap">
                    <thead>
                      <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Produits</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                      {salesReport.sales.map((sale) => (
                        <tr key={sale.id} className="text-gray-700 dark:text-gray-400">
                          <td className="px-4 py-3">
                            {format(new Date(sale.date), "Pp", { locale: fr })}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {sale.client}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {sale.totalItems} articles
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {sale.total} XOF
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${sale.status === "completed"
                              ? "text-green-700 bg-green-100 dark:text-green-100 dark:bg-green-700"
                              : "text-orange-700 bg-orange-100 dark:text-orange-100 dark:bg-orange-700"
                              }`}>
                              {sale.status === "completed" ? "Terminée" : "En cours"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "products" && productReport && (
              <div className="w-full overflow-hidden rounded-lg shadow-xs">
                <div className="w-full overflow-x-auto">
                  <table className="w-full whitespace-no-wrap">
                    <thead>
                      <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                        <th className="px-4 py-3">Produit</th>
                        <th className="px-4 py-3">Catégorie</th>
                        <th className="px-4 py-3">Quantité vendue</th>
                        <th className="px-4 py-3">Chiffre d'affaires</th>
                        <th className="px-4 py-3">Stock actuel</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                      {productReport.products.map((product) => (
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
                            {product.category}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {product.quantitySold}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {product.revenue} XOF
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${product.stock > product.minStock
                              ? "text-green-700 bg-green-100 dark:text-green-100 dark:bg-green-700"
                              : "text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700"
                              }`}>
                              {product.stock}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ReportsManager;
