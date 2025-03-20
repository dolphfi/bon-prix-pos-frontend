import { createContext, useContext } from "react";
import { UrlProducts } from "../public/BaseUrls";
import Auth from './AuthContext';
// import { useNavigate } from "react-router-dom";

const Prod = createContext();
const baseUrlProd = UrlProducts;

export default Prod;

export const ProdProvider = ({ children }) => {
    // const navigate = useNavigate();
    const { fetchWithAuth } = useContext(Auth)

    if (!fetchWithAuth) {
        console.error("fetchWithAuth n'est pas défini dans ProdContext");
    }

    // const createProduct = async (formData) => {
    //     try {
    //         const response = await fetchWithAuth(`${baseUrlProd}create`, {
    //             method: 'POST',
    //             body: formData,
    //         });

    //         if (!response.ok) {
    //             console.error(`Erreur HTTP : ${response.status}`);
    //             return null;
    //         }

    //         const data = await response.json();
    //         console.log("Données de création du produit :", data);

    //         return data;
    //     } catch (error) {
    //         console.error("Erreur lors de la création du produit :", error);
    //     }
    // };

    const UpdateProduct = async (id, formData) => {
        try {
            const response = await fetchWithAuth(`${baseUrlProd}update/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                console.error(`Erreur HTTP : ${response.status}`);
                return null;
            }

            const data = await response.json();
            console.log("Données de mise à jour du produit :", data);

            return data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour du produit :", error);
        }
    };

    const getAllProducts = async () => {
        try {
            const response = await fetchWithAuth(`${baseUrlProd}all-products`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error(`Erreur HTTP : ${response.status}`);
                return null;
            }

            const data = await response.json();
            console.log("Données des produits :", data);

            return data;
        } catch (error) {
            console.error("Erreur lors de la récupération des produits :", error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            const response = await fetchWithAuth(`${baseUrlProd}delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Vérifie si le corps de la réponse n'est pas vide
            const responseText = await response.text();
            if (responseText) {
                const data = JSON.parse(responseText);
                console.log("Données de suppression du produit :", data);
                return data;
            } else {
                console.log("Aucune donnée retournée par le serveur.");
                return null;
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du produit :", error);
        }
    };





    return (
        <Prod.Provider value={{ getAllProducts, deleteProduct, UpdateProduct, }}>
            {children}
        </Prod.Provider>
    );
};