import { createContext, useContext, useState } from 'react';
import { UrlSales } from '../public/BaseUrls';
import Auth from './AuthContext';
import { toast } from 'react-toastify';

const Sales = createContext();
const baseUrlSales = UrlSales;

export default Sales;

export const SalesProvider = ({ children }) => {
    const { fetchWithAuth } = useContext(Auth);
    const [cart, setCart] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [appliedPromotions, setAppliedPromotions] = useState([]);

    // Gestion du panier
    const addToCart = (product, variant = null, batch = null, quantity = 1) => {
        const existingItem = cart.find(item => 
            item.productId === product.id && 
            item.variantId === (variant?.id || null) && 
            item.batchId === (batch?.id || null)
        );

        if (existingItem) {
            // Mettre à jour la quantité si l'article existe déjà
            updateCartItemQuantity(existingItem.id, existingItem.quantity + quantity);
        } else {
            // Ajouter un nouvel article
            const newItem = {
                id: Date.now(), // ID temporaire pour la gestion du panier
                productId: product.id,
                variantId: variant?.id || null,
                batchId: batch?.id || null,
                quantity,
                unitPrice: variant?.price || product.price,
                discountAmount: 0,
                subtotal: (variant?.price || product.price) * quantity,
                total: (variant?.price || product.price) * quantity,
                product,
                variant,
                batch
            };
            setCart([...cart, newItem]);
        }
        recalculateCart();
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId));
        recalculateCart();
    };

    const updateCartItemQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(cart.map(item => {
            if (item.id === itemId) {
                const subtotal = item.unitPrice * newQuantity;
                return {
                    ...item,
                    quantity: newQuantity,
                    subtotal,
                    total: subtotal - (item.discountAmount * newQuantity)
                };
            }
            return item;
        }));
        recalculateCart();
    };

    const clearCart = () => {
        setCart([]);
        setSelectedCustomer(null);
        setAppliedPromotions([]);
    };

    // Gestion des promotions
    const applyPromotion = async (promotionId) => {
        try {
            const response = await fetchWithAuth(`${baseUrlSales}promotions/${promotionId}/calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart })
            });

            if (!response.ok) throw new Error('Erreur lors de l\'application de la promotion');

            const data = await response.json();
            setCart(data.items);
            setAppliedPromotions([...appliedPromotions, data.promotion]);
            recalculateCart();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const removePromotion = (promotionId) => {
        setAppliedPromotions(appliedPromotions.filter(p => p.id !== promotionId));
        recalculateCart();
    };

    // Calculs
    const recalculateCart = () => {
        let subtotal = 0;
        let total = 0;

        cart.forEach(item => {
            subtotal += item.subtotal;
            total += item.total;
        });

        // Appliquer les promotions globales si nécessaire
        appliedPromotions.forEach(promotion => {
            if (promotion.type === 'GLOBAL') {
                total -= promotion.amount;
            }
        });

        return { subtotal, total };
    };

    // Création de vente
    const createSale = async () => {
        try {
            const { subtotal, total } = recalculateCart();
            const saleData = {
                customerId: selectedCustomer?.id,
                items: cart.map(item => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    batchId: item.batchId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    discountAmount: item.discountAmount,
                    subtotal: item.subtotal,
                    total: item.total
                })),
                subtotal,
                total,
                promotions: appliedPromotions.map(p => p.id)
            };

            const response = await fetchWithAuth(baseUrlSales, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(saleData)
            });

            if (!response.ok) throw new Error('Erreur lors de la création de la vente');

            const data = await response.json();
            clearCart();
            toast.success('Vente créée avec succès');
            return data;
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    // Historique des ventes
    const getSales = async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetchWithAuth(`${baseUrlSales}?${queryParams}`);
            if (!response.ok) throw new Error('Erreur lors de la récupération des ventes');
            return await response.json();
        } catch (error) {
            toast.error(error.message);
            return [];
        }
    };

    const getSaleById = async (id) => {
        try {
            const response = await fetchWithAuth(`${baseUrlSales}${id}`);
            if (!response.ok) throw new Error('Erreur lors de la récupération de la vente');
            return await response.json();
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    return (
        <Sales.Provider value={{
            cart,
            selectedCustomer,
            appliedPromotions,
            addToCart,
            removeFromCart,
            updateCartItemQuantity,
            clearCart,
            setSelectedCustomer,
            applyPromotion,
            removePromotion,
            createSale,
            getSales,
            getSaleById,
            recalculateCart
        }}>
            {children}
        </Sales.Provider>
    );
};
