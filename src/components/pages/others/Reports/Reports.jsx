import React, { useState, useEffect } from "react";
import Sidebar from "../../../includes/Sidebar";
import Header from "../../../includes/Header";
import Footer from "../../../includes/Footer";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import './Reports.css';
import { useDashboard } from '../../../context/DashboardContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const isSideMenuOpen = true;

const ReportsManager = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [period, setPeriod] = useState("day");
  const {
    salesTrends,
    topProducts,
    stockAlerts,
    revenueStats,
    getSalesTrends,
    getTopProducts,
    getStockAlerts,
    getRevenueStats,
    loading
  } = useDashboard();

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      if (!isMounted) return;

      try {
        await Promise.all([
          getSalesTrends(period),
          getTopProducts(5),
          getStockAlerts(),
          getRevenueStats()
        ]);
      } catch (error) {
        if (isMounted) {
          console.error("Erreur lors du chargement des données:", error);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [period]);

  const [filters, setFilters] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    minAmount: "",
    maxAmount: "",
    status: "all",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
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
        <Line data={data} options={{ responsive: true }} />
      </div>
    );
  };

  const renderStockAlerts = () => {
    if (!stockAlerts) return null;

    return (
      <div className="stock-alerts">
        <h3>Alertes de stock</h3>
        <div className="alert-list">
          {stockAlerts && stockAlerts.length > 0 ? (
            stockAlerts.map(alert => (
              <div key={alert.id} className="alert-item p-4 mb-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                <span className="product-name font-semibold text-gray-700 dark:text-gray-300">{alert.productName}</span>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <span className="stock-level text-sm">
                    Stock actuel: <span className="font-medium">{alert.currentStock}</span>
                  </span>
                  <span className="min-stock text-sm">
                    Stock minimum: <span className="font-medium">{alert.minQuantity}</span>
                  </span>
                  <span className={`status px-3 py-1 text-sm font-medium rounded-full text-center
                    ${alert.status === 'LOW' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      alert.status === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                    {alert.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-center">
              Aucune alerte de stock à afficher
            </div>
          )}
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
        <Line data={data} options={{ responsive: true }} />
      </div>
    );
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isSideMenuOpen ? "overflow-hidden" : ""
      }`}>
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />
        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto grid">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Rapports
            </h2>

            {/* Onglets */}
            <div className="mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`${activeTab === "dashboard"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Tableau de bord
                  </button>
                  <button
                    onClick={() => setActiveTab("sales")}
                    className={`${activeTab === "sales"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Ventes
                  </button>
                  <button
                    onClick={() => setActiveTab("products")}
                    className={`${activeTab === "products"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Produits
                  </button>
                </nav>
              </div>
            </div>

            {/* Filtres */}
            <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Période
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-primary-400 focus:outline-none focus:shadow-outline-primary dark:focus:shadow-outline-gray"
                  >
                    <option value="day">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                    <option value="year">Cette année</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contenu des onglets */}
            <div className="grid gap-6 mb-8 md:grid-cols-2">
              {/* Graphique des tendances de ventes */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                {renderSalesTrendsChart()}
              </div>

              {/* Graphique des meilleurs produits */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                {renderTopProductsChart()}
              </div>

              {/* Alertes de stock */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                {renderStockAlerts()}
              </div>

              {/* Statistiques de revenus */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                {renderRevenueStats()}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ReportsManager;
