import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Auth from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user } = useContext(Auth);

    // Si l'utilisateur n'est pas authentifié, redirige vers la page de connexion
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Si l'utilisateur est authentifié, affiche les enfants (la route privée)
    return children;
}

export default PrivateRoute;
