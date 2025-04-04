import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { UrlProducts } from '../public/BaseUrls';
import { UrlCategory } from '../public/BaseUrls';
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
  const getProducts = useCallback(async (filters = {}) => {
    try {
      const response = await fetchWithAuth(`${UrlProducts}all-products`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des produits');
      return [];
    }
  }, [fetchWithAuth]);

  // Gestion des catégories
  const getCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const response = await fetchWithAuth(`${UrlCategory}all-category`);
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
  }, [fetchWithAuth]);

  const createCategory = async (categoryData) => {
    try {
      const response = await fetchWithAuth(`${UrlCategory}add-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création de la catégorie');
      }

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
      const response = await fetchWithAuth(`${UrlCategory}${id}`, {
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
      await fetchWithAuth(`${UrlCategory}${id}`, {
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
  const createProduct = async (formData) => {
    try {
      setLoading(true);

      // Vérifier que le FormData contient une image
      const image = formData.get('image');
      if (!image) {
        throw new Error('Une image est requise pour le produit');
      }

      // Extraire et structurer les données du produit
      const productData = {
        name: formData.get('name'),
        description: formData.get('description'),
        basePrice: parseFloat(formData.get('basePrice')),
        stock: parseInt(formData.get('stock')),
        categoryId: formData.get('categoryId'),
        minStockLevel: parseInt(formData.get('minStockLevel')) || 0,
        sku: formData.get('sku'),
        mainBarcode: formData.get('mainBarcode') || '',
        specifications: formData.get('specifications') ? JSON.parse(formData.get('specifications')) : {},
        alertLevel: formData.get('alertLevel') || 'MEDIUM',
        tags: formData.get('tags')?.split(',').map(t => t.trim()) || [],
        discount: parseFloat(formData.get('discount')) || 0,
        discountExpiry: parseFloat(formData.get('discount')) > 0 ? formData.get('discountExpiry') : null,
        isActive: true
      };

      // Créer un nouveau FormData
      const newFormData = new FormData();
      newFormData.append('image', image);
      Object.keys(productData).forEach(key => {
        newFormData.append(key, typeof productData[key] === 'object' ?
          JSON.stringify(productData[key]) : productData[key]);
      });

      const response = await fetchWithAuth(`${UrlProducts}add-products`, {
        method: 'POST',
        body: newFormData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création du produit');
      }

      await getProducts(); // Recharger la liste des produits
      // toast.success('Produit créé avec succès');
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de la création du produit');
      throw error; // Propager l'erreur pour la gérer dans le composant
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
      createCategory,
      updateCategory,
      deleteCategory,
    }}>
      {children}
    </ProductContext.Provider>
  );
};
