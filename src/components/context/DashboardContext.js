import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { UrlDashboard } from '../public/BaseUrls';
import { useAuth } from './AuthContext';

const Dashboard = createContext();

export const DashboardProvider = ({ children }) => {
  const { fetchWithAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [salesTrends, setSalesTrends] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [revenueStats, setRevenueStats] = useState({
    sales: 0,
    costs: 0,
    profit: 0
  });

  const handleApiError = (error, message) => {
    console.error('Erreur:', error);
    toast.error(message);
    return null;
  };

  const getSalesTrends = async (period = 'day') => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${UrlDashboard}trends?period=${period}`);
      if (!response.ok) throw new Error('Erreur serveur');
      const data = await response.json();
      setSalesTrends(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      return handleApiError(error, 'Erreur lors du chargement des tendances');
    } finally {
      setLoading(false);
    }
  };

  const getTopProducts = async (limit = 5) => {
    try {
      const response = await fetchWithAuth(`${UrlDashboard}top-products?limit=${limit}`);
      if (!response.ok) throw new Error('Erreur serveur');
      const data = await response.json();
      setTopProducts(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      return handleApiError(error, 'Erreur lors du chargement des meilleurs produits');
    }
  };

  const getStockAlerts = async () => {
    try {
      const response = await fetchWithAuth(`${UrlDashboard}stock-alerts`);
      if (!response.ok) throw new Error('Erreur serveur');
      const data = await response.json();
      setStockAlerts(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      return handleApiError(error, 'Erreur lors du chargement des alertes de stock');
    }
  };

  const getRevenueStats = async () => {
    try {
      const response = await fetchWithAuth(`${UrlDashboard}revenue-stats`);
      if (!response.ok) throw new Error('Erreur serveur');
      const data = await response.json();
      setRevenueStats(data || { sales: 0, costs: 0, profit: 0 });
      return data;
    } catch (error) {
      return handleApiError(error, 'Erreur lors du chargement des statistiques');
    }
  };

  const value = {
    loading,
    salesTrends,
    topProducts,
    stockAlerts,
    revenueStats,
    getSalesTrends,
    getTopProducts,
    getStockAlerts,
    getRevenueStats
  };

  return <Dashboard.Provider value={value}>{children}</Dashboard.Provider>;
};

export const useDashboard = () => {
  const context = useContext(Dashboard);
  if (!context) {
    throw new Error('useDashboard doit être utilisé à l\'intérieur d\'un DashboardProvider');
  }
  return context;
};

export default Dashboard;
