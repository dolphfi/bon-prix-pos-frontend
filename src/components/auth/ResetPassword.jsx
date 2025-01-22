import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Auth from "../context/AuthContext";
import { toast } from "react-toastify";

export const ResetPassword = () => {
  const { resetPassword } = useContext(Auth);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const [token, setToken] = useState(null);
  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.password.trim())
      newErrors.password = "Le mot de passe est requis.";
    if (!formData.confirm_password.trim()) {
      newErrors.confirm_password =
        "Le mot de passe de confirmation est requis.";
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Les mots de passe ne correspondent pas.";
    }

    setErrors(newErrors);

    // Si aucun champ n'a d'erreur, le formulaire est valide
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // Validation immédiate du champ modifié
    let error = "";

    if (field === "password" && !value.trim()) {
      error = "Le mot de passe est requis.";
    } else if (field === "confirm_password") {
      if (!value.trim()) {
        error = "Le mot de passe de confirmation est requis.";
      } else if (value !== formData.password) {
        error = "Les mots de passe ne correspondent pas.";
      }
    }

    setErrors({ ...errors, [field]: error });
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    if (!token) {
      toast.error("Le token de réinitialisation est manquant.");
    }
    setToken(token);
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, formData.password);
      // toast.success("Mot de passe réinitialisé avec succès", {
      //   position: "top-right",
      //   autoClose: 5000,
      // });
    } catch (error) {
      toast.error("Erreur lors de la réinitialisation du mot de passe", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto ">
            {/* md:flex-row */}
            <div className="flex p-6 sm:p-12">
              <div className="w-full">
                <div className="flex items-center justify-center mt-1">
                  <img
                    className="object-cover w-56 h-auto"
                    src="../assets/img/bon.png"
                    alt="Logo"
                  />
                </div>
                <form onSubmit={handleSubmit}>
                  <label className="block text-sm">
                    <span className="text-gray-700 dark:text-gray-400">
                      Password
                    </span>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input ${
                        errors.password && "border-error"
                      }`}
                    />
                    {/* Réserver l'espace pour le message d'erreur */}
                    <small
                      className={`text-xs text-red-600 mt-1 block`}
                      style={{ minHeight: "20px" }} // Ajustez la hauteur selon vos besoins
                    >
                      {errors.password || "\u00A0"}{" "}
                      {/* Ajoutez un espace non-brisé si aucune erreur */}
                    </small>
                  </label>
                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">
                      Confirm Password
                    </span>
                    <input
                      type="password"
                      value={formData.confirm_password}
                      onChange={(e) =>
                        handleInputChange("confirm_password", e.target.value)
                      }
                      className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input ${
                        errors.confirm_password && "border-error"
                      }`}
                    />
                    {/* Réserver l'espace pour le message d'erreur */}
                    <small
                      className={`text-xs text-red-600 mt-1 block`}
                      style={{ minHeight: "20px" }} // Ajustez la hauteur selon vos besoins
                    >
                      {errors.confirm_password || "\u00A0"}{" "}
                      {/* Ajoutez un espace non-brisé si aucune erreur */}
                    </small>
                  </label>
                  <button
                    className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Change in
                        progress...
                      </>
                    ) : (
                      <>Change Password</>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
