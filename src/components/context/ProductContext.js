import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { UrlProducts } from '../public/BaseUrls';
import { useAuth } from './AuthContext';

const ProductContext = createContext(null);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const { fetchWithAuth } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Récupérer tous les produits
  const getProducts = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetchWithAuth(`${UrlProducts}all-products${queryParams ? `?${queryParams}` : ''}`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des produits');
      return [];
    }
  };

  // Gestion des catégories
  const getCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetchWithAuth(`${UrlProducts}categories`);
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des catégories');
      return [];
    } finally {
      setLoadingCategories(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const response = await fetchWithAuth(`${UrlProducts}categories`, {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      await getCategories();
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const response = await fetchWithAuth(`${UrlProducts}categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      await getCategories();
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await fetchWithAuth(`${UrlProducts}categories/${id}`, {
        method: 'DELETE',
      });
      await getCategories();
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  // Récupérer un produit par ID
  const getProductById = async (id) => {
    try {
      const response = await fetchWithAuth(`${UrlProducts}detail-product/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement du produit');
      return null;
    }
  };

  // Créer un nouveau produit
  const createProduct = async (productData) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${UrlProducts}add-products`, {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      await getProducts(); // Recharger la liste des produits
      toast.success('Produit créé avec succès');
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la création du produit');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un produit
  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${UrlProducts}update-product/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      await getProducts(); // Recharger la liste des produits
      toast.success('Produit mis à jour avec succès');
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour du produit');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un produit
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      await fetchWithAuth(`${UrlProducts}delete/${id}`, {
        method: 'DELETE',
      });
      await getProducts(); // Recharger la liste des produits
      toast.success('Produit supprimé avec succès');
      return true;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression du produit');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Gestion des variantes
  const addVariant = async (productId, variantData) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${UrlProducts}${productId}/variants`, {
        method: 'POST',
        body: JSON.stringify(variantData),
      });
      const data = await response.json();
      await getProducts(); // Recharger la liste des produits
      toast.success('Variante ajoutée avec succès');
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'ajout de la variante');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Gestion des lots
  const addBatch = async (productId, variantId, batchData) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${UrlProducts}${productId}/variants/${variantId}/batches`, {
        method: 'POST',
        body: JSON.stringify(batchData),
      });
      const data = await response.json();
      await getProducts(); // Recharger la liste des produits
      toast.success('Lot ajouté avec succès');
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'ajout du lot');
      return null;
    } finally {
      setLoading(false);
    }
  };


  // Gestion du stock
  const updateStock = async (productId, variantId, quantity, type = 'add') => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${UrlProducts}${productId}/stock`, {
        method: 'POST',
        body: JSON.stringify({ variantId, quantity, type }),
      });
      const data = await response.json();
      await getProducts(); // Recharger la liste des produits
      toast.success('Stock mis à jour avec succès');
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour du stock');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const initializeData = useCallback(async () => {
    try {
      setLoading(true);
      const productsData = await getProducts();
      setProducts(productsData);

      const categoriesData = await getCategories();
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      toast.error('Erreur lors du chargement des données');
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [getProducts, getCategories]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return (
    <ProductContext.Provider value={{
      products,
      categories,
      loading,
      loadingCategories,
      getProducts,
      getProductById,
      createProduct,
      updateProduct,
      deleteProduct,
      addVariant,
      addBatch,
      getCategories,
      updateStock,
    }}>
      {children}
    </ProductContext.Provider>
  );
};
