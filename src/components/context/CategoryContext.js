import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CategoryContext = createContext();
const UrlCategories = `${process.env.REACT_APP_API_URL}/categories/`;

export const CategoryProvider = ({ children }) => {
  const { fetchWithAuth } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Récupérer toutes les catégories
  const getCategories = async () => {
    try {
      const response = await fetchWithAuth(UrlCategories);
      const data = await response.json();
      setCategories(data);
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des catégories');
      return [];
    }
  };

  // Récupérer les catégories principales
  const getMainCategories = async () => {
    try {
      const response = await fetchWithAuth(`${UrlCategories}main`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des catégories principales');
      return [];
    }
  };

  // Récupérer les sous-catégories
  const getSubcategories = async (parentId) => {
    try {
      const response = await fetchWithAuth(`${UrlCategories}sub/${parentId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des sous-catégories');
      return [];
    }
  };

  // Créer une nouvelle catégorie
  const createCategory = async (categoryData) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(UrlCategories, {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      await getCategories(); // Recharger la liste des catégories
      toast.success('Catégorie créée avec succès');
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la création de la catégorie');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour une catégorie
  const updateCategory = async (id, categoryData) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${UrlCategories}${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      await getCategories(); // Recharger la liste des catégories
      toast.success('Catégorie mise à jour avec succès');
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour de la catégorie');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une catégorie
  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      await fetchWithAuth(`${UrlCategories}${id}`, {
        method: 'DELETE',
      });
      await getCategories(); // Recharger la liste des catégories
      toast.success('Catégorie supprimée avec succès');
      return true;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression de la catégorie');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        getCategories,
        getMainCategories,
        getSubcategories,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
