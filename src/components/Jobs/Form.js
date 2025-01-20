import React, { useContext, useState } from 'react';
import Auth from '../context/AuthContext';

export const UsersForm = ({ closeModal }) => {
    const { registerUser } = useContext(Auth);
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        username: '',
        password: '',
        confirm_password: '',
        roles: '',
    });

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis.';
        if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis.';
        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "L'email n'est pas valide.";
        }
        if (!formData.username.trim()) newErrors.username = 'Le username est requis.';
        if (!formData.password.trim()) newErrors.password = 'Le mot de passe est requis.';
        if (!formData.confirm_password.trim()) {
            newErrors.confirm_password = 'Le mot de passe de confirmation est requis.';
        } else if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = 'Les mots de passe ne correspondent pas.';
        }
        if (!formData.roles) newErrors.roles = 'Le rôle est requis.';

        setErrors(newErrors);

        // Si aucun champ n'a d'erreur, le formulaire est valide
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });

        // Validation immédiate du champ modifié
        let error = '';

        if (field === 'email') {
            if (!value.trim()) {
                error = 'L\'email est requis.';
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                error = "L'email n'est pas valide.";
            }
        } else if (field === 'nom' && !value.trim()) {
            error = 'Le nom est requis.';
        } else if (field === 'prenom' && !value.trim()) {
            error = 'Le prénom est requis.';
        } else if (field === 'username' && !value.trim()) {
            error = 'Le username est requis.';
        } else if (field === 'password' && !value.trim()) {
            error = 'Le mot de passe est requis.';
        } else if (field === 'confirm_password') {
            if (!value.trim()) {
                error = 'Le mot de passe de confirmation est requis.';
            } else if (value !== formData.password) {
                error = 'Les mots de passe ne correspondent pas.';
            }
        }

        setErrors({ ...errors, [field]: error });
    };

    const handleFileChangeUser = (e) => {
        const file = e.target.files[0];
        console.log('Fichier sélectionné:', file); // Vérifie que le fichier est bien sélectionné
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                photo: file, // Assure-toi que la photo est bien mise à jour
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formDataToSend = new FormData();

        // Ajoute tous les champs de formData sauf la photo
        Object.keys(formData).forEach((key) => {
            if (key !== 'photo') {
                formDataToSend.append(key, formData[key]);
            }
        });

        // Ajouter la photo si elle est présente
        if (formData.photo) {
            formDataToSend.append('photo', formData.photo);
        }

        // Vérifier si la photo est bien ajoutée
        for (let pair of formDataToSend.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            setLoading(true);
            await registerUser(formDataToSend);  // Envoie via FormData
            setLoading(false);
            // Réinitialiser le formulaire et fermer le modal après l'inscription réussie
            setFormData({
                nom: '',
                prenom: '',
                email: '',
                username: '',
                password: '',
                confirm_password: '',
                roles: '',
            });
            setPhoto(null); // Effacer l'image
            setErrors({}); // Réinitialiser les erreurs
            if (closeModal) closeModal(); // Appeler la fonction de fermeture du modal
        } catch (err) {
            console.error('Erreur lors de l\'inscription:', err);
            setLoading(false);
        }
    };

    const calculateProgress = () => {
        const fieldsFilled = Object.keys(formData).filter(
            (key) => formData[key] && formData[key] !== ""
        ).length;
        const totalFields = Object.keys(formData).length;
        return Math.round((fieldsFilled / totalFields) * 100);
    };

    const progressPercent = calculateProgress();

    return (
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 mt-2">
            <form
                onSubmit={handleSubmit}
                // className="row g-2"
                encType="multipart/form-data"
            >
                {/* Barre de progression */}
                <div className="progress-container">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        >
                            {/* Texte optionnel, rendu invisible */}
                            <span className="visually-hidden">
                                {progressPercent}%
                            </span>
                        </div>
                    </div>
                    <div className="progress-text">
                        {progressPercent}% complété
                    </div>
                </div>
                {/* end Barre de progression */}

                <div className="block text-sm inline-flex items-center">
                    <div className="block text-sm inline-block ml-4 items-center">
                        <label className="text-gray-700 dark:text-gray-400">Nom</label>
                        <input
                            type="text"
                            value={formData.nom}
                            onChange={(e) => handleInputChange('nom', e.target.value)}
                            className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input ${errors.nom && 'border-error'}`}
                        />
                        {/* Réserver l'espace pour le message d'erreur */}
                        <small
                            className={`text-xs text-red-600 mt-1 block`}
                            style={{ minHeight: '20px' }} // Ajustez la hauteur selon vos besoins
                        >
                            {errors.nom || '\u00A0'} {/* Ajoutez un espace non-brisé si aucune erreur */}
                        </small>
                    </div>

                    <div className="block text-sm inline-block ml-4 items-center">
                        <label className="text-gray-700 dark:text-gray-400">Prénom</label>
                        <input
                            type="text"
                            value={formData.prenom}
                            onChange={(e) => handleInputChange('prenom', e.target.value)}
                            className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input ${errors.prenom && 'border-error'}`}
                        />
                        {/* Réserver l'espace pour le message d'erreur */}
                        <small
                            className={`text-xs text-red-600 mt-1 block`}
                            style={{ minHeight: '20px' }} // Ajustez la hauteur selon vos besoins
                        >
                            {errors.prenom || '\u00A0'} {/* Ajoutez un espace non-brisé si aucune erreur */}
                        </small>
                    </div>
                </div>
                <div className="block text-sm inline-flex items-center">
                    <div className="block text-sm inline-block ml-4 items-center">
                        <label className="text-gray-700 dark:text-gray-400">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input ${errors.email && 'border-error'}`}
                        />
                        {/* Réserver l'espace pour le message d'erreur */}
                        <small
                            className={`text-xs text-red-600 mt-1 block`}
                            style={{ minHeight: '20px' }} // Ajustez la hauteur selon vos besoins
                        >
                            {errors.email || '\u00A0'} {/* Ajoutez un espace non-brisé si aucune erreur */}
                        </small>
                    </div>
                    <div className="block text-sm inline-block ml-4 items-center">
                        <label className="text-gray-700 dark:text-gray-400">Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input ${errors.username && 'border-error'}`}
                        />
                        {/* Réserver l'espace pour le message d'erreur */}
                        <small
                            className={`text-xs text-red-600 mt-1 block`}
                            style={{ minHeight: '20px' }} // Ajustez la hauteur selon vos besoins
                        >
                            {errors.username || '\u00A0'} {/* Ajoutez un espace non-brisé si aucune erreur */}
                        </small>
                    </div>
                </div>
                <div className="block text-sm inline-flex items-center">
                    <div className="block text-sm inline-block ml-4 items-center">
                        <label className="text-gray-700 dark:text-gray-400">Mot de passe</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input ${errors.password && 'border-error'}`}
                        />
                        {/* Réserver l'espace pour le message d'erreur */}
                        <small
                            className={`text-xs text-red-600 mt-1 block`}
                            style={{ minHeight: '20px' }} // Ajustez la hauteur selon vos besoins
                        >
                            {errors.password || '\u00A0'} {/* Ajoutez un espace non-brisé si aucune erreur */}
                        </small>
                    </div>
                    <div className="block text-sm inline-block ml-4 items-center">
                        <label className="text-gray-700 dark:text-gray-400">Confirmer mot de passe</label>
                        <input
                            type="password"
                            value={formData.confirm_password}
                            onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                            className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input ${errors.confirm_password && 'border-error'}`}
                        />
                        {/* Réserver l'espace pour le message d'erreur */}
                        <small
                            className={`text-xs text-red-600 mt-1 block`}
                            style={{ minHeight: '20px' }} // Ajustez la hauteur selon vos besoins
                        >
                            {errors.confirm_password || '\u00A0'} {/* Ajoutez un espace non-brisé si aucune erreur */}
                        </small>
                    </div>
                </div>
                <div className="block text-sm inline-flex  items-center">
                    <div className="block text-sm inline-block ml-4 items-center">
                        <label className="text-gray-700 dark:text-gray-400">Rôle</label>
                        <select
                            value={formData.roles}
                            onChange={(e) => handleInputChange('roles', e.target.value)}
                            className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input ${errors.roles && 'border-error'}`}
                        >
                            <option value="">Sélectionnez un rôle</option>
                            <option value="admin">Admin</option>
                            <option value="caissier">Caissier</option>
                        </select>
                        {/* Réserver l'espace pour le message d'erreur */}
                        <small
                            className={`text-xs text-red-600 mt-1 block`}
                            style={{ minHeight: '20px' }} // Ajustez la hauteur selon vos besoins
                        >
                            {errors.roles || '\u00A0'} {/* Ajoutez un espace non-brisé si aucune erreur */}
                        </small>
                    </div>
                    <div className="block text-sm inline-block ml-4 items-center">

                        <label className="text-gray-700 dark:text-gray-400">Photo</label>
                        <input
                            className="block mt-1 text-sm form-input dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            // block mt-1 text-sm  form-input
                            type="file"
                            onChange={handleFileChangeUser}
                        />
                        {/* Réserver l'espace pour le message d'erreur */}
                        <small
                            className={`text-xs mt-1 block`}
                            style={{ minHeight: '20px' }} // Ajustez la hauteur selon vos besoins
                        >
                            {photo && <img src={photo} alt="Aperçu" className="object-cover w-full h-full rounded-full" />}
                        </small>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full flex items-center justify-center px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                >
                    {loading ? (
                        'Chargement...'
                    ) : (
                        <>
                            <span>Save</span>
                            <i className="ri-save-line w-4 h-4 ml-2 -mr-1"></i>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export const updateUserForm = ({ closeModal }) => {
    return (
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 mt-2">
            <h2 className="text-lg font-bold mb-4">Modifier l'utilisateur</h2>
        </div>
    );

};
