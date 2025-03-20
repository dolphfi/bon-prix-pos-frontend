/*eslint-disable*/
import React, { useContext, useState } from 'react';
import Auth from '../context/AuthContext';
import { UrlPhoto } from "../public/BaseUrls";
import Prod from '../context/ProductsContext';

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

export const UpdateUserForm = () => {
    const { user } = useContext(Auth);
    return (
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 mt-2">
            <h2 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-200">Modifier l'utilisateur</h2>
            <form encType="multipart/form-data">
                <div className="block text-sm inline-flex ml-4 mx-auto mt-8">
                    <div className="flex items-center justify-center w-56 h-full overflow-hidden border-2 border-gray-100  dark:border-gray-700">
                        <img src={`${UrlPhoto}${user.photo || ''}`} alt="Aperçu" />
                    </div>
                    <div className="block text-sm inline-block items-center">
                        <div className="block text-sm inline-block items-center">
                            <div className="ml-4">
                                <label className="text-gray-700 dark:text-gray-400">
                                    Nom
                                </label>
                                <input
                                    type="text"
                                    value={user.nom || ''}
                                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input"
                                    disabled
                                />
                            </div>
                            <div className="ml-4">
                                <label className="text-gray-700 dark:text-gray-400">
                                    Prénom
                                </label>
                                <input
                                    type="text"
                                    value={user.prenom || ''}
                                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input"
                                    disabled
                                />
                            </div>
                            <div className="ml-4">
                                <label className="text-gray-700 dark:text-gray-400">
                                    Email
                                </label>
                                <input
                                    type="text"
                                    value={user.email || ''}
                                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="block text-sm inline-block items-center">
                            <div className="ml-4">
                                <label className="text-gray-700 dark:text-gray-400">
                                    Created At
                                </label>
                                <input
                                    type="text"
                                    value={user.email}
                                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input"
                                    disabled
                                />
                            </div>
                            <div className="ml-4">
                                <label className="text-gray-700 dark:text-gray-400">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={user.username || ''}
                                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input"
                                    disabled
                                />
                            </div>
                            <div className="ml-4">
                                <label className="text-gray-700 dark:text-gray-400">
                                    Rôle
                                </label>
                                <input
                                    type="text"
                                    value={user.roles || ''}
                                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );

};

export const ProductsForm = ({ closeModal }) => {
    return (
        <p>Products</p>
    );
};

export const UpdateProductsForm = ({ item, onClose }) => {
    const { UpdateProduct } = useContext(Prod);
    // const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: item.name || '',
        image: item.image || '',
        price: item.price || '',
        stock: item.stock || '',
        category: item.category || '',
        description: item.description || '',
        discount: item.discount || '',
        discountExpiry: item.discountExpiry || ''
    });

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Le nom est requis.';
        // Validation du champ image
        // Validation du champ image, mais l'image n'est pas obligatoire
        if (formData.image && !/\.(jpg|jpeg|png)$/i.test(formData.image.name)) {
            newErrors.image = 'Seuls les fichiers JPG, JPEG, et PNG sont acceptés.';
        }
        if (formData.price === undefined || formData.price === null || formData.price === '') {
            newErrors.price = 'Le prix est requis.';
        } else if (isNaN(Number(formData.price))) {
            newErrors.price = 'Le prix doit être un nombre valide (par exemple 100 ou 100.50).';
        } else if (Number(formData.price) <= 0) {
            newErrors.price = 'Le prix doit être supérieur à zéro.';
        }

        if (formData.stock === undefined || formData.stock === null || formData.stock === '') {
            newErrors.stock = 'Le stock est requis.';
        } else if (!Number.isInteger(Number(formData.stock))) {
            newErrors.stock = 'Le stock doit être un nombre entier.';
        } else if (Number(formData.stock) <= 0) {
            newErrors.stock = 'Le stock doit être supérieur à zéro.';
        }
        if (!formData.description.trim()) newErrors.description = 'La description est requise.';
        if (!formData.category.trim()) newErrors.category = 'La catégorie est requise.';
        // Validation du champ discount
        if (formData.discount && formData.discount.toString().trim()) {
            const discount = Number(formData.discount);
            if (isNaN(discount)) {
                newErrors.discount = 'La remise doit être un nombre valide.';
            } else if (discount < 0) {
                newErrors.discount = 'La remise ne peut pas être inférieure à zéro.';
            } else if (discount > 100) {
                newErrors.discount = 'La remise ne peut pas dépasser 100%.';
            }
        }
        // Validation pour discount et discountexpiry
        if (formData.discount && !formData.discountExpiry) {
            newErrors.discountExpiry = 'Une date d\'expiration est requise si un discount est renseigné.';
        }
        setErrors(newErrors);
        // Si aucun champ n'a d'erreur, le formulaire est valide
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value, });

        // Validation immédiate du champ modifié
        let error = '';

        if (field === 'image') {
            if (value && value.name && !/\.(jpg|jpeg|png)$/i.test(value.name)) {
                error = "Seuls les fichiers JPG, JPEG et PNG sont acceptés.";
            }
        } else if (field === 'name' && !value.trim()) {
            error = 'Le nom est requis.';
        } else if (field === 'price') {
            const price = Number(value);
            if (isNaN(price)) {
                error = 'Le prix doit être un nombre valide (par exemple 100 ou 100.50).';
            } else if (price <= 0) {
                error = 'Le prix doit être supérieur à zéro.';
            }
        } else if (field === 'stock') {
            const stock = Number(value);
            if (!Number.isInteger(stock)) {
                error = 'Le stock doit être un nombre entier.';
            } else if (stock <= 0) {
                error = 'Le stock doit être supérieur à zéro.';
            }
        } else if (field === 'description' && !value.trim()) {
            error = 'La description est requise.';
        } else if (field === 'category' && !value.trim()) {
            error = 'La catégorie est requise.';
        } else if (field === 'discount') {
            const discount = Number(value);
            if (value.trim() && isNaN(discount)) {
                error = 'La remise doit être un nombre valide.';
            } else if (discount < 0) {
                error = 'La remise ne peut pas être inférieure à zéro.';
            } else if (discount > 100) {
                error = 'La remise ne peut pas dépasser 100%.';
            }
        } else if (field === 'discountExpiry') {
            if (formData.discount && !value.trim()) {
                error = 'Une date d\'expiration est requise si un discount est renseigné.';
            }
        }

        setErrors({ ...errors, [field]: error });
    };

    const handleFileChangeProduct = (e) => {
        const file = e.target.files[0];
        // console.log('Fichier sélectionné:', file); // Vérifie que le fichier est bien sélectionné
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                image: file, // Assure-toi que l'image est bien mise à jour
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        // Gérer le changement de l'image avec handleInputChange
        handleInputChange('image', file);

        // Si tu veux ajouter d'autres actions avec handleFileChangeProduct, tu peux les ajouter ici
        handleFileChangeProduct(e);  // Appelle la fonction handleFileChangeProduct (si elle contient de la logique supplémentaire)
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formDataToSend = new FormData();

        // Ajoute tous les champs de formData
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            setLoading(true);
            await UpdateProduct(item.id, formDataToSend);
            console.log(item.id, formDataToSend);

            setLoading(false);
            setErrors({}); // Réinitialiser les erreurs
            onClose(); // Appeler la fonction de fermeture du modal
        } catch (error) {
            console.error('Erreur lors de la modification:', error);
            setLoading(false);
        }
    };

    return (
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 mt-2">
            <h2 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-200">Edit Product</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="block text-sm inline-flex items-center">
                    <div className="block text-sm inline-block ml-4 items-center">
                        <label className="text-gray-700 dark:text-gray-400">Nom</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input ${errors.name && 'border-error'}`}
                        />
                        {/* Réserver l'espace pour le message d'erreur */}
                        <small
                            className={`text-xs text-red-600 mt-1 block`}
                            style={{ minHeight: '20px' }}
                        >
                            {errors.name || '\u00A0'} {/* Ajoutez un espace non-brisé si aucune erreur */}
                        </small>
                    </div>
                    <div className="block text-sm inline-block ml-4 items-center">
                        <label className="text-gray-700 dark:text-gray-400">Description</label>
                        <textarea
                            type="text"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input ${errors.description && 'border-error'}`}
                        />
                        {/* Réserver l'espace pour le message d'erreur */}
                        <small
                            className={`text-xs text-red-600 mt-1 block`}
                            style={{ minHeight: '20px' }} // Ajustez la hauteur selon vos besoins
                        >
                            {errors.description || '\u00A0'} {/*Ajoutez un espace non-brisé si aucune erreur */}
                        </small>
                    </div>
                </div>
                <div className="block text-sm inline-flex items-center">
                    <div className="block text-sm inline-block ml-4 items-center">
                        <label className="text-gray-700 dark:text-gray-400">Prix</label>
                        <input
                            type="text"
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input ${errors.price && 'border-error'}`}
                        />
                        {/* Réserver l'espace pour le message d'erreur */}
                        <small
                            className={`text-xs text-red-600 mt-1 block`}
                            style={{ minHeight: '20px' }} // Ajustez la hauteur selon vos besoins
                        >
                            {errors.price || '\u00A0'} {/* Ajoutez un espace non-brisé si aucune erreur */}
                        </small>
                    </div>
                    <div className="block text-sm inline-block ml-4 items-center">
                        <label className="text-gray-700 dark:text-gray-400">Stock</label>
                        <input
                            type="text"
                            value={formData.stock}
                            onChange={(e) => handleInputChange('stock', e.target.value)}
                            className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input ${errors.stock && 'border-error'}`}
                        />
                        {/* Réserver l'espace pour le message d'erreur */}
                        <small
                            className={`text-xs text-red-600 mt-1 block`}
                            style={{ minHeight: '20px' }} // Ajustez la hauteur selon vos besoins
                        >
                            {errors.stock || '\u00A0'} {/* Ajoutez un espace non-brisé si aucune erreur */}
                        </small>
                    </div>
                </div>
                <div className="block text-sm inline-flex items-center">
                    <div className="block text-sm inline-block ml-4 items-center">
                        <label className="text-gray-700 dark:text-gray-400">Remise <span className='text-xs'>(en %)</span></label>
                        <input
                            type="text"
                            value={formData.discount}
                            onChange={(e) => handleInputChange('discount', e.target.value)}
                            className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input ${errors.discount && 'border-error'}`}
                        />
                        {/* Réserver l'espace pour le message d'erreur */}
                        <small
                            className={`text-xs text-red-600 mt-1 block`}
                            style={{ minHeight: '20px' }} // Ajustez la hauteur selon vos besoins
                        >
                            {errors.discount || '\u00A0'} {/* Ajoutez un espace non-brisé si aucune erreur */}
                        </small>
                    </div>
                    <div className="block text-sm inline-block ml-4 items-center">
                        <label className="text-gray-700 dark:text-gray-400">Remise <span className='text-xs'>(date expiration)</span> </label>
                        <input
                            type="date"
                            value={formData.discountExpiry}
                            onChange={(e) => handleInputChange('discountExpiry', e.target.value)}
                            className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input ${errors.discountExpiry && 'border-error'}`}
                        />
                        {/* Réserver l'espace pour le message d'erreur */}
                        <small
                            className={`text-xs text-red-600 mt-1 block`}
                            style={{ minHeight: '20px' }} // Ajustez la hauteur selon vos besoins
                        >
                            {errors.discountExpiry || '\u00A0'} {/* Ajoutez un espace non-brisé si aucune erreur */}
                        </small>
                    </div>
                </div>
                <div className="block text-sm inline-flex  items-center">
                    <div className="block text-sm inline-block ml-4 items-center">
                        <label className="text-gray-700 dark:text-gray-400">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input ${errors.category && 'border-error'}`}
                        >
                            <option value="">Sélectionnez un category</option>
                            <option value="beverages">Beverages</option>
                            <option value="condiments">Condiments</option>
                            <option value="confectionery">Confectionery</option>
                            <option value="dairy products">DairyProducts</option>
                            <option value="grains/cereals">GrainsCereals</option>
                            <option value="meat/poultry">MeatPoultry</option>
                            <option value="produce">Produce</option>
                            <option value="seafood">Seafood</option>
                            <option value="other">Other</option>
                        </select>
                        {/* Réserver l'espace pour le message d'erreur */}
                        <small
                            className={`text-xs text-red-600 mt-1 block`}
                            style={{ minHeight: '20px' }} // Ajustez la hauteur selon vos besoins
                        >
                            {errors.category || '\u00A0'} {/* Ajoutez un espace non-brisé si aucune erreur */}
                        </small>
                    </div>
                    <div className="block text-sm inline-block ml-4 items-center">
                        <label className="text-gray-700 dark:text-gray-400">Image</label>
                        <input
                            className="block mt-1 text-sm form-input dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            type="file"
                            // onChange={(e) => handleInputChange('image', e.target.files[0])} // Utiliser files[0]
                            onChange={handleFileChange}
                        />
                        {/* Réserver l'espace pour le message d'erreur */}
                        <small
                            className={`text-xs text-red-600 mt-1 block`}
                            style={{ minHeight: '20px' }}
                        >
                            {errors.image || '\u00A0'} {/* Affiche une espace non-brisé si aucune erreur */}
                        </small>
                    </div>

                </div>
                <div className="flex items-center justify-center w-56 h-full overflow-hidden border-2 border-gray-100  dark:border-gray-700">
                    <img src={`${UrlPhoto}${formData.image || ''}`} alt="Aperçu" />
                </div>
                <div className=" text-sm items-end justify-end ">
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full flex px-4 py-2 items-center justify-center text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                        {loading ? (
                            'Chargement...'
                        ) : (
                            <>
                                <span>Update</span>
                                <i className="ri-pencil-line ml-2"></i>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
