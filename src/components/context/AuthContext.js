const { createContext } = require("react");
import checkNetworkStatus from '../public/www/Network';
const { UrlAuth } = require("../public/BaseUrls");

const Auth = createContext();
const baseUrl = UrlAuth;
export default Auth
export const AuthProvider = ({ children }) => {
    // État pour suivre l'état du réseau
    const [isOnline, setIsOnline] = useState(checkNetworkStatus());
    const [loading, setLoading] = useState(true);


    //useEffect for check network status
    useEffect(() => {
        // Fonction pour mettre à jour l'état
        const updateNetworkStatus = () => {
            setIsOnline(checkNetworkStatus());
        };

        // Ajout des écouteurs d'événements
        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);

        // Nettoyage des écouteurs lors du démontage
        return () => {
            window.removeEventListener('online', updateNetworkStatus);
            window.removeEventListener('offline', updateNetworkStatus);
        };
    }, []);



    const contextData = {
        isOnline,
    }

    return (
        <Auth.Provider value={contextData}>
            {loading ? null : children}
        </Auth.Provider>
    )
}
