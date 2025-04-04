import { createContext, useContext, useState, useEffect } from 'react';
import { UrlSales, UrlProducts } from '../public/BaseUrls';
import Auth from './AuthContext';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const SalesContext = createContext();

export const useSales = () => {
    const context = useContext(SalesContext);
    if (!context) {
        throw new Error('useSales must be used within a SalesProvider');
    }
    return context;
};

export const SalesProvider = ({ children }) => {
    const { token } = useAuth();
    const { fetchWithAuth } = useContext(Auth);
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [appliedPromotions, setAppliedPromotions] = useState([]);
    const [taxRate, setTaxRate] = useState(0); // Taux de TVA en pourcentage

    // État global du panier
    const [cartTotals, setCartTotals] = useState({
        subtotal: 0,
        tax: 0,
        discountAmount: 0,
        total: 0,
        quantity: 0,
        currency: 'HTG'
    });

    // Sauvegarder le panier dans localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        recalculateCart(cart);
    }, [cart]);

    // Gestion du panier
    const addToCart = (product, quantity = 1) => {
        const existingItem = cart.find(item => item.productId === product.id);

        if (existingItem) {
            updateCartItemQuantity(existingItem.id, existingItem.quantity + quantity);
        } else {
            const unitPrice = parseFloat(product.basePrice) || 0;
            const subtotal = unitPrice * quantity;
            const newItem = {
                id: Date.now(),
                productId: product.id,
                quantity,
                unitPrice,
                discountAmount: 0,
                subtotal,
                total: subtotal,
                product,
                metadata: {
                    notes: ''
                }
            };
            const updatedCart = [...cart, newItem];
            setCart(updatedCart);
            recalculateCart(updatedCart);
        }
    };

    const removeFromCart = (itemId) => {
        const updatedCart = cart.filter(item => item.id !== itemId);
        setCart(updatedCart);
        recalculateCart(updatedCart);
    };

    const updateCartItemQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        const updatedCart = cart.map(item => {
            if (item.id === itemId) {
                const subtotal = item.unitPrice * newQuantity;
                return {
                    ...item,
                    quantity: newQuantity,
                    subtotal,
                    total: subtotal - item.discountAmount
                };
            }
            return item;
        });

        setCart(updatedCart);
        recalculateCart(updatedCart);
    };

    const updateCartItemDiscount = (itemId, discountAmount) => {
        const updatedCart = cart.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    discountAmount,
                    total: item.subtotal - discountAmount
                };
            }
            return item;
        });

        setCart(updatedCart);
        recalculateCart(updatedCart);
    };

    const clearCart = () => {
        setCart([]);
        setSelectedCustomer(null);
        setAppliedPromotions([]);
        setCartTotals({
            subtotal: 0,
            tax: 0,
            discountAmount: 0,
            total: 0,
            quantity: 0,
            currency: 'HTG'
        });
    };

    // Gestion des promotions
    const applyPromotion = (promotion) => {
        setAppliedPromotions([...appliedPromotions, promotion]);
        recalculateCart(cart);
    };

    const removePromotion = (promotionId) => {
        setAppliedPromotions(appliedPromotions.filter(p => p.id !== promotionId));
        recalculateCart(cart);
    };

    // Calcul des totaux
    const recalculateCart = (currentCart) => {
        const totals = currentCart.reduce((acc, item) => ({
            subtotal: acc.subtotal + (parseFloat(item.unitPrice) * item.quantity),
            quantity: acc.quantity + item.quantity,
            discountAmount: acc.discountAmount + (parseFloat(item.discountAmount) || 0)
        }), { subtotal: 0, quantity: 0, discountAmount: 0 });

        const tax = totals.subtotal * (taxRate / 100);
        const total = totals.subtotal - totals.discountAmount + tax;

        setCartTotals({
            ...totals,
            tax,
            total,
            currency: 'HTG'
        });
    };

    // Recherche de produits
    const searchProducts = async (searchTerm) => {
        if (searchTerm.length < 2) {
            return [];
        }

        try {
            const response = await fetch(`${UrlProducts}all-products`);
            if (!response.ok) throw new Error('Erreur lors de la recherche');
            const data = await response.json();
            // Filtrer les produits côté client
            return data.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } catch (error) {
            console.error('Erreur:', error);
            throw new Error('Erreur lors de la recherche des produits');
        }
    };

    // Opérations de vente
    const createSale = async () => {
        try {
            const saleData = {
                customerId: selectedCustomer?.id,
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    discountAmount: item.discountAmount,
                    subtotal: item.subtotal,
                    total: item.total,
                    metadata: item.metadata
                })),
                promotions: appliedPromotions.map(p => p.id),
                ...cartTotals,
                status: 'COMPLETED'
            };

            const response = await fetchWithAuth(`${UrlSales}add-sale`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(saleData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Sale result:', result);

                // Si l'impression a échoué et qu'on doit télécharger le reçu
                if (result.receipt?.shouldDownload) {
                    toast.info('Aucune imprimante disponible. Téléchargement du reçu...');
                    await handleDownloadReceipt(result.id);
                }

                clearCart();
                toast.success('Vente créée avec succès');
                return result;
            }
            throw new Error('Erreur lors de la création de la vente');
        } catch (error) {
            console.error('Error creating sale:', error);
            toast.error('Erreur lors de la création de la vente');
            return null;
        }
    };

    // Gestion des ventes en attente
    const savePendingSale = async () => {
        try {
            const saleData = {
                customerId: selectedCustomer?.id,
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    discountAmount: item.discountAmount,
                    subtotal: item.subtotal,
                    total: item.total,
                    metadata: item.metadata
                })),
                promotions: appliedPromotions.map(p => p.id),
                subtotal: cartTotals.subtotal,
                tax: cartTotals.tax,
                total: cartTotals.total,
                discountAmount: cartTotals.discountAmount,
                status: 'PENDING'
            };

            const response = await fetchWithAuth(`${UrlSales}add-pending`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(saleData)
            });

            if (response.ok) {
                const result = await response.json();
                clearCart();
                toast.success('Vente sauvegardée en attente');
                return result;
            }
            throw new Error('Erreur lors de la sauvegarde de la vente');
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    const getPendingSales = async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetchWithAuth(`${UrlSales}all-pending`);

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Erreur lors de la récupération des ventes en attente');
        } catch (error) {
            toast.error(error.message);
            return { sales: [], total: 0 };
        }
    };

    const deletePendingSale = async (id) => {
        try {
            const response = await fetchWithAuth(`${UrlSales}pending-sales/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('Vente en attente supprimée');
                return true;
            }
            throw new Error('Erreur lors de la suppression de la vente');
        } catch (error) {
            toast.error(error.message);
            return false;
        }
    };

    // Gestion des factures proforma
    const createProforma = async (expiryDate) => {
        try {
            const proformaData = {
                customerId: selectedCustomer?.id,
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    discountAmount: item.discountAmount,
                    subtotal: item.subtotal,
                    total: item.total,
                    metadata: item.metadata
                })),
                promotions: appliedPromotions.map(p => p.id),
                ...cartTotals,
                expiryDate
            };

            const response = await fetchWithAuth(`${UrlSales}proforma`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(proformaData)
            });

            if (response.ok) {
                const result = await response.json();
                clearCart();
                toast.success('Facture proforma créée');
                return result;
            }
            throw new Error('Erreur lors de la création de la facture proforma');
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    const getProformaInvoices = async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetchWithAuth(`${UrlSales}proforma?${queryParams}`);

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Erreur lors de la récupération des factures proforma');
        } catch (error) {
            toast.error(error.message);
            return { proformas: [], total: 0 };
        }
    };

    const deleteProforma = async (id) => {
        try {
            const response = await fetchWithAuth(`${UrlSales}proforma/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('Facture proforma supprimée');
                return true;
            }
            throw new Error('Erreur lors de la suppression de la facture proforma');
        } catch (error) {
            toast.error(error.message);
            return false;
        }
    };

    // Conversion en vente
    const convertToSale = async (id, type) => {
        try {
            const response = await fetchWithAuth(`${UrlSales}${type}/${id}/convert`, {
                method: 'POST'
            });

            if (response.ok) {
                toast.success('Conversion en vente réussie');
                return await response.json();
            }
            throw new Error('Erreur lors de la conversion en vente');
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    // Historique des ventes
    const getSales = async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetchWithAuth(`${UrlSales}all-sales?${queryParams}`);

            if (response.ok) {
                const responseData = await response.json();
                return { data: { items: responseData.data || [], total: responseData.total || 0 } };
            }
            throw new Error('Erreur lors de la récupération des ventes');
        } catch (error) {
            toast.error(error.message);
            return { data: { items: [], total: 0 } };
        }
    };

    // Impression du reçu
    const printReceipt = async (saleId) => {
        try {
            const response = await fetchWithAuth(`${UrlSales}${saleId}/receipt`, {
                method: 'POST'
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                window.open(url);
                return true;
            }
            throw new Error('Erreur lors de l\'impression du reçu');
        } catch (error) {
            toast.error(error.message);
            return false;
        }
    };

    // Téléchargement du reçu
    const handleDownloadReceipt = async (saleId) => {
        try {
            console.log('Downloading receipt for sale:', saleId);
            const response = await fetchWithAuth(`${UrlSales}download/${saleId}`, {
                method: 'GET',
                responseType: 'blob'
            });

            if (!response.ok) {
                throw new Error('Failed to download receipt');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `receipt_${saleId}.pdf`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            
            // Nettoyer
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);

            toast.success('Reçu téléchargé avec succès');
        } catch (error) {
            console.error('Error downloading receipt:', error);
            toast.error('Erreur lors du téléchargement du reçu');
        }
    };

    return (
        <SalesContext.Provider value={{
            // État du panier
            cart,
            setCart,
            addToCart,
            removeFromCart,
            updateCartItemQuantity,
            clearCart,
            cartTotals,
            selectedCustomer,
            setSelectedCustomer,
            appliedPromotions,
            setAppliedPromotions,
            taxRate,
            setTaxRate,

            // Actions sur les ventes
            getSales,
            createSale,
            printReceipt,
            handleDownloadReceipt,

            // Ventes en attente
            getPendingSales,
            savePendingSale,
            deletePendingSale,

            // Factures proforma
            getProformaInvoices,
            createProforma,
            deleteProforma,

            // Conversion
            convertToSale,

            // Recherche de produits
            searchProducts
        }}>
            {children}
        </SalesContext.Provider>
    );
};

export default SalesContext;
