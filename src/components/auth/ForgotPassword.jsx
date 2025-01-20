import { useContext, useState } from "react";
import React from "react";
import Auth from "../context/AuthContext";
import { Bounce, toast } from "react-toastify";

export const ForgotPassword = () => {
  const { forgortPassword } = useContext(Auth);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide.";
    }
    setErrors(newErrors);

    // Si aucun champ n'a d'erreur, le formulaire est valide
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // Validation immédiate du champ modifié
    let error = "";

    if (field === "email") {
      if (!value.trim()) {
        error = "L'email est requis.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "L'email n'est pas valide.";
      }
    }

    setErrors({ ...errors, [field]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formDataToSend = formData.email; // Vous avez déjà la bonne structure ici

    setLoading(true);
    try {
      console.log(formData.email);
      await forgortPassword(formDataToSend);
      setFormData({ email: "" });
      setErrors({});
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Une erreur est survenue. Veuillez réessayer.";
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
                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">
                      Email
                    </span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input ${
                        errors.email && "border-error"
                      }`}
                    />
                    {/* Réserver l'espace pour le message d'erreur */}
                    <small
                      className={`text-xs text-red-600 mt-1 block`}
                      style={{ minHeight: "20px" }} // Ajustez la hauteur selon vos besoins
                    >
                      {errors.email || "\u00A0"}{" "}
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
                        <i className="fas fa-spinner fa-spin"></i> Email Sent...
                      </>
                    ) : (
                      <>Send</>
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
