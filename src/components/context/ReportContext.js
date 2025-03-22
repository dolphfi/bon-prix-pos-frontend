import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { UrlReports } from '../public/BaseUrls';
import { useAuth } from './AuthContext';

const Reports = createContext();

export const ReportProvider = ({ children }) => {
  const { fetchWithAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [salesReport, setSalesReport] = useState(null);
  const [productPerformance, setProductPerformance] = useState(null);

  // Récupérer les données du tableau de bord
  const getDashboardData = async (period = 'today') => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${UrlReports}dashboard?period=${period}`);
      const data = await response.json();
      setDashboardData(data);
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement du tableau de bord');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer le rapport des ventes
  const getSalesReport = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetchWithAuth(`${UrlReports}sales?${queryParams}`);
      const data = await response.json();
      setSalesReport(data);
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement du rapport des ventes');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les performances des produits
  const getProductPerformance = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetchWithAuth(`${UrlReports}products?${queryParams}`);
      const data = await response.json();
      setProductPerformance(data);
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des performances produits');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Exporter les données en CSV
  const exportToCSV = async (reportType, filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetchWithAuth(`${UrlReports}export/${reportType}?${queryParams}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Export réussi');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'export');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Générer un rapport personnalisé
  const generateCustomReport = async (config) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${UrlReports}custom`, {
        method: 'POST',
        body: JSON.stringify(config),
      });
      const data = await response.json();
      toast.success('Rapport généré avec succès');
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
    <Reports.Provider value={{
      loading,
      dashboardData,
      salesReport,
      productPerformance,
      getDashboardData,
      getSalesReport,
      getProductPerformance,
      exportToCSV,
      generateCustomReport,
    }}>
      {children}
    </Reports.Provider>
  );
};

export const useReports = () => {
  const context = useContext(Reports);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};

export default Reports;
