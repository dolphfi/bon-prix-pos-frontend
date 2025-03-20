/*eslint-disable*/
import { createContext, useState, useEffect, useCallback } from "react";
import { Bounce, toast } from 'react-toastify';
import { UrlAuth, UrlProducts, UrlUsers } from "../public/BaseUrls";
import { jwtDecode } from 'jwt-decode'; // Corrected import
import { useNavigate } from 'react-router-dom';

const Auth = createContext();
const baseUrl = UrlAuth;
const baseUrlUsers = UrlUsers;
const baseUrlProd = UrlProducts;

export default Auth;

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [loading, setloading] = useState(true);
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );
    const [user, setUser] = useState(() => {
        const tokens = localStorage.getItem("authTokens");
        return tokens ? jwtDecode(JSON.parse(tokens).access_token) : null; // Use the decoded token
    });

    const checkInternetConnection = useCallback(() => {
        setIsOnline(navigator.onLine);
    }, []);

    useEffect(() => {
        window.addEventListener("online", checkInternetConnection);
        window.addEventListener("offline", checkInternetConnection);

        return () => {
            window.removeEventListener("online", checkInternetConnection);
            window.removeEventListener("offline", checkInternetConnection);
        };
    }, [checkInternetConnection]);

    useEffect(() => {
        if (authTokens && authTokens.access_token) {
            setUser(jwtDecode(authTokens.access_token));  // Decode the access token if available
        } else {
            setUser(null);  // Clear the user if there's no valid token
        }
        setloading(false);
    }, [authTokens]);


    // LOGIN function
    const login = async (identifier, password) => {
        if (!isOnline) {
            toast.warn('No internet connection', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
            return false;
        }

        try {
            // console.log("Attempting to login with:", identifier, password);

            const response = await fetch(`${baseUrl}login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            });

            // console.log("Response status:", response.status);

            if (!response.ok) {
                const errorMessage = (await response.json()).message || 'Invalid credentials';
                toast.error(errorMessage, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });
                return false;
            }

            const data = await response.json();
            // console.log("Server response:", data);

            if (data.access_token) {
                // console.log("User status (isActive):", data.user?.isActive);
                // Vérifie si l'utilisateur est actif
                if (data.user && typeof data.user.isActive !== 'undefined' && !data.user.isActive) {
                    toast.error('Your account is deactivated. Please contact support.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "light",
                        transition: Bounce,
                    });
                    return false;
                }
                const decodedUser = jwtDecode(data.access_token);
                // console.log('Decoded user:', decodedUser);

                setAuthTokens(data);
                setUser({
                    ...decodedUser,
                    roles: data.user?.roles || [], // Ajoute les rôles si présents dans `data.user`
                });

                localStorage.setItem("authTokens", JSON.stringify(data));
                navigate("/dashboard");

                toast.success('Login successful', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });

                return true;
            } else {
                toast.error('Invalid response format from server', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });
                return false;
            }
        } catch (error) {
            console.error("Server error:", error);
            toast.error('An error occurred. Please try again later.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
            return false;
        }
    };

    //LOGOUT function
    const logoutUser = useCallback(() => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        navigate("/");

        toast.error('LogOut!!!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce
        });
    }, [setAuthTokens, setUser]);

    //user photo from local storage
    const getUserPhotoFromLocalStorage = () => {
        const authTokens = JSON.parse(localStorage.getItem('authTokens'));
        if (authTokens && authTokens.user) {
            return authTokens.user.photo;
        }
        return null;
    };

    // Action by roles
    const registerUser = async (formData) => {
        try {
            const response = await fetchWithAuth(`${baseUrl}register`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                window.location.reload();
                toast.success('Register successful', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });
            } else {
                // Si la réponse n'est pas ok, on récupère le message d'erreur du backend
                const errorData = await response.json();
                toast.error(errorData.message || 'Registration failed', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });
            }
        } catch (err) {
            console.error('Erreur lors de l\'inscription:', err);
            toast.error('Registration failed', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
        }
    };

    const getAllUsers = async () => {
        const response = await fetchWithAuth(`${baseUrlUsers}all-users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    }

    const toggleUserActivation = async (id) => {
        try {
            const response = await fetchWithAuth(`${baseUrlUsers}toggle-activation/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ id }),  // Si tu souhaites passer l'ID dans le corps de la requête
            });

            if (!response.ok) {
                toast.error('Une erreur est survenue. l\'activation/desactivation de l\'utilisateur Impossible.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });
            }
            // const data = await response.json();
            // console.log('Utilisateur activé/désactivé avec succès:', data);
        } catch (err) {
            toast.error('Une erreur est survenue. Impossible de modifier l\'activation de l\'utilisateur.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
            console.error('Erreur lors de l\'activation/désactivation de l\'utilisateur:', err);
        } finally {
            setloading(false);
        }
    };

    const getUserDetails = async (id) => {
        if (!id) {
            console.error("L'ID utilisateur est manquant.");
            return null;
        }

        try {
            const response = await fetchWithAuth(`${baseUrlUsers}detail-user/${id}`, { method: 'GET' });

            if (!response.ok) {
                toast.error("Erreur : Impossible de récupérer les détails de l'utilisateur.");
                return null;
            }

            const data = await response.json();
            // console.log("Détails de l'utilisateur :", data);
            return data;
        } catch (error) {
            toast.error("Erreur lors de la récupération des détails.");
            console.error("Erreur :", error);
        } finally {
            setloading(false);
        }
    }

    const updateRole = async (id, role) => {
        try {
            const response = await fetchWithAuth(`${baseUrlUsers}update-role/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ role }),
            });

            if (!response.ok) {
                toast.error("Erreur : Impossible de mettre à jour le rôle de l'utilisateur.");
                return null;
            }

            const data = await response.json();
            // console.log("Rôle de l'utilisateur mis à jour avec succès :", data);
            return data;
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du rôle.");
            console.error("Erreur :", error);
        } finally {
            setloading(false);
        }
    }

    const forgortPassword = async (email) => {
        try {
            // Assurez-vous d'envoyer seulement l'email, sans être imbriqué dans un objet supplémentaire
            const response = await fetch(`${baseUrl}forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }), // Envoyer seulement l'email
            });

            if (response.ok) {
                const data = await response.json();
                // console.log("Mot de passe oublié envoyé avec succès :", data);
                toast.success(data, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });
            } else {
                const error = await response.json();
                toast.error(error.message);
            }
        } catch (error) {
            toast.error("Erreur lors de la récupération du mot de passe.");
            console.error("Erreur :", error);
        }
    };

    const resetPassword = async (token, newPassword) => {
        try {
            const response = await fetch(`${baseUrl}reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data);
                // console.log("Mot de passe réinitialisé avec succès :", data);
                navigate('/')
            } else {
                toast.error(data.message || "Erreur lors de la réinitialisation.");
            }
        } catch (error) {
            toast.error('Une erreur est survenue lors de la réinitialisation.');
        } finally {
            setloading(false);
        }
    };

    const Profile = async () => {
        setloading(true);
        try {
            const response = await fetchWithAuth(`${baseUrl}profile`, {
                method: 'GET',
            });

            if (!response.ok) {
                toast.error("Erreur : Impossible de récupérer les détails de l'utilisateur.");
                return null;
            }

            const data = await response.json();
            // console.log("Détails de l'utilisateur Profile:", data);
            setUser(data);
        } catch (error) {
            // toast.error("Erreur lors de la récupération des détails.");
            console.error("Erreur :", error);
        } finally {
            setloading(false);
        }

    };

    useEffect(() => {
        Profile(); // Charger le profil lors du montage
    }, []);

    const updateProfile = async (formData) => {
        try {
            const response = await fetchWithAuth(`${baseUrl}update-profile`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                toast.error("Erreur : Impossible de mettre à jour le profil.");
                return null;
            }
            const data = await response.json();
            // console.log("Profil mis à jour avec succès :", data);
            return data;
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du profil.");
            console.error("Erreur :", error);
        } finally {
            setloading(false);
        }
    }




    // Fonction pour vérifier si le token est valide (pas expiré)
    const isValidTokenCheck = (token) => {
        try {
            if (!token) {
                console.error('Token manquant');
                return false;
            }

            const decodedToken = jwtDecode(token);
            console.log(decodedToken);

            const currentTime = Date.now() / 1000; // Convertir en secondes
            return decodedToken.exp > currentTime;
        } catch (error) {
            console.error('Erreur lors de la validation du token :', error);
            return false;
        }
    };

    const fetchWithAuth = async (url, options = {}) => {
        try {
            const storedAuthTokens = localStorage.getItem('authTokens');
            if (!storedAuthTokens) {
                console.error("Aucun authTokens trouvé dans localStorage.");
                return;
            }

            const token = JSON.parse(storedAuthTokens)?.access_token;
            if (!token) {
                console.error("Aucun jeton d'accès trouvé dans authTokens.");
                return;
            }

            const headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache', // Empêche le cache
                'Pragma': 'no-cache',        // Parfois utile pour garantir la compatibilité avec certains serveurs
            };

            // Supprimer l'en-tête 'Content-Type' si body est un FormData
            if (!(options.body instanceof FormData)) {
                headers['Content-Type'] = headers['Content-Type'] || 'application/json';
            }

            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (response.status === 401) {
                // Token expiré ou invalide, vérifier le token
                const isValid = isValidTokenCheck(token);
                if (!isValid) {
                    // Token expiré, déconnecter l'utilisateur
                    console.log('Token expiré, déconnexion en cours...');
                    logoutUser();  // Déconnexion de l'utilisateur
                    return;  // Arrêter ici, car l'utilisateur a été déconnecté
                }
            }

            return response;
        } catch (error) {
            toast.error('Fetch with auth error:' + error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
            console.error("Fetch with auth error:", error);
            throw error;
        }
    };

    const checkTokenExpiration = useCallback(async () => {
        console.log("Checking token expiration...");
        const token = localStorage.getItem('authTokens');

        if (!token) {
            console.log("No tokens found for expiration check.");
            return;
        }

        let parsedToken;
        try {
            parsedToken = JSON.parse(token); // Parse the JSON string
        } catch (error) {
            console.error("Error parsing token from localStorage:", error);
            return;
        }

        const accessToken = parsedToken?.access_token; // Use the correct key here

        if (!accessToken || typeof accessToken !== "string") {
            console.error("Invalid or missing access token during expiration check.");
            return;
        }

        try {
            const decodedToken = jwtDecode(accessToken); // Decode the token
            if (!decodedToken || typeof decodedToken.exp !== "number") {
                console.error("Invalid decoded token structure:", decodedToken);
                return;
            }

            const isExpired = Date.now() >= decodedToken.exp * 1000;
            console.log("Token expiration status:", isExpired ? "Expired" : "Valid");

            if (isExpired) {
                logoutUser();
                toast.warn('Session expirée. Veuillez vous reconnecter.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });
                console.log("Session expired. Please log in again.");
            }
        } catch (error) {
            console.error("Error decoding token during expiration check:", error);
        }
    }, [logoutUser]);

    // Vérification de l'expiration du token chaque minute
    useEffect(() => {
        console.log("Setting up token expiration check interval...");
        const interval = setInterval(() => {
            checkTokenExpiration();
        }, 60000);

        return () => clearInterval(interval);
    }, [checkTokenExpiration]);




    const contextData = { user, setUser, authTokens, setAuthTokens, loading, isOnline, login, logoutUser, getUserPhotoFromLocalStorage, registerUser, getAllUsers, toggleUserActivation, fetchWithAuth, getUserDetails, updateRole, forgortPassword, resetPassword, Profile, updateProfile };

    return (
        <Auth.Provider value={contextData}>
            {/* {loading ? (
                <div style={{ textAlign: "center" }}>
                    <div className="loader-containerh">
                        <div className="loaderh"></div>
                        <img
                            src="/assets/img/bon1.png"
                            style={{ width: "70px", height: "70px" }}
                            alt="Logo"
                            className="loader-logo"
                        />
                    </div>
                </div>
            ) : (
                children
            )} */}
            {loading ? null : children}
        </Auth.Provider>
    );
};
