import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { UrlDashboard } from '../public/BaseUrls';
import { useAuth } from './AuthContext';

const Dashboard = createContext();

export const DashboardProvider = ({ children }) => {
  const { fetchWithAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [salesTrends, setSalesTrends] = useState(null);
  const [topProducts, setTopProducts] = useState(null);
  const [stockAlerts, setStockAlerts] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);

  // Récupérer les tendances des ventes
  const getSalesTrends = async (period = 'week') => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${UrlDashboard}trends?period=${period}`);
      const data = await response.json();
      setSalesTrends(data);
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des tendances');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les meilleurs produits
  const getTopProducts = async (limit = 5) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${UrlDashboard}top-products?limit=${limit}`);
      const data = await response.json();
      setTopProducts(data);
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des meilleurs produits');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les alertes de stock
  const getStockAlerts = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${UrlDashboard}stock-alerts`);
      const data = await response.json();
      setStockAlerts(data);
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des alertes de stock');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les statistiques de revenus
  const getRevenueStats = async (period = 'month') => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${UrlDashboard}revenue?period=${period}`);
      const data = await response.json();
      setRevenueStats(data);
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des statistiques de revenus');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Configurer les alertes
  const configureAlerts = async (config) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${UrlDashboard}configure-alerts`, {
        method: 'POST',
        body: JSON.stringify(config),
      });
      const data = await response.json();
      toast.success('Configuration des alertes mise à jour');
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la configuration des alertes');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Générer un rapport de performance
  const generatePerformanceReport = async (config) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${UrlDashboard}performance-report`, {
        method: 'POST',
        body: JSON.stringify(config),
      });
      const data = await response.json();
      toast.success('Rapport de performance généré');
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération du rapport');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard.Provider value={{
      loading,
      salesTrends,
      topProducts,
      stockAlerts,
      revenueStats,
      getSalesTrends,
      getTopProducts,
      getStockAlerts,
      getRevenueStats,
      configureAlerts,
      generatePerformanceReport,
    }}>
      {children}
    </Dashboard.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(Dashboard);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export default Dashboard;
