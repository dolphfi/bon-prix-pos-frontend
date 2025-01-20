import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Auth from "../../context/AuthContext";
import Header from "../../includes/Header";
import Sidebar from "../../includes/Sidebar";
import { toast } from "react-toastify";
import { UrlPhoto } from "../../public/BaseUrls";

const UserDetails = () => {
  const { getUserDetails, updateRole } = useContext(Auth);
  const { id } = useParams();
  const [records, setRecords] = useState(null); // Initialisez avec null pour éviter les valeurs par défaut
  const [loading, setLoading] = useState(false);
  const isSideMenuOpen = true;

  useEffect(() => {
    if (!id) {
      toast.error("ID utilisateur manquant.");
      return;
    }

    setLoading(true);
    getUserDetails(id)
      .then((data) => {
        if (data) {
          setRecords((prevRecords) => {
            // Vérifier que les données sont différentes avant de les mettre à jour
            return JSON.stringify(data) !== JSON.stringify(prevRecords)
              ? data
              : prevRecords;
          });
        }
      })
      .catch(() => {
        toast.error("Erreur lors de la récupération des détails.");
      })
      .finally(() => setLoading(false));
  }, [getUserDetails, id]);

  const handleRoleChange = async (e) => {
    const newRole = e.target.value;
    if (newRole !== records?.roles) {
      // Vérifie si le rôle a réellement changé
      try {
        setLoading(true); // Déclencher le loader ici pour le bouton
        await updateRole(id, newRole);
        toast.success("Rôle mis à jour avec succès.");
        setRecords((prevRecords) => ({
          ...prevRecords,
          roles: newRole, // Mise à jour du rôle localement après succès
        }));
      } catch (error) {
        toast.error("Erreur lors de la mise à jour du rôle.");
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${
        isSideMenuOpen ? "overflow-hidden" : ""
      }`}
    >
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />
        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto grid">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Détails de l'utilisateur
            </h2>
            <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 mt-2">
              <form encType="multipart/form-data">
                <div className="block text-sm inline-flex ml-4 mx-auto mt-8">
                  <div className="flex items-center justify-center w-56 h-full overflow-hidden border-2 border-gray-100  dark:border-gray-700">
                    {records?.photo && (
                      <img src={`${UrlPhoto}${records.photo}`} alt="Aperçu" />
                    )}
                  </div>
                  <div className="block text-sm inline-block items-center">
                    <div className="block text-sm inline-block items-center">
                      <div className="ml-4">
                        <label className="text-gray-700 dark:text-gray-400">
                          Nom
                        </label>
                        <input
                          type="text"
                          value={records?.nom || ""}
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
                          value={records?.prenom || ""}
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
                          value={records?.email || ""}
                          className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input"
                          disabled
                        />
                      </div>
                      {/* <div className="ml-4">
                        <label className="text-gray-700 dark:text-gray-400">
                          Email
                        </label>
                        <input
                          type="text"
                          value={records?.email || ""}
                          className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input"
                          disabled
                        />
                      </div> */}
                    </div>
                    <div className="block text-sm inline-block items-center">
                      <div className="ml-4">
                        <label className="text-gray-700 dark:text-gray-400">
                          Created At
                        </label>
                        <input
                          type="text"
                          value={records?.createdAt || ""}
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
                          value={records?.username || ""}
                          className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 form-input"
                          disabled
                        />
                      </div>
                      <div className="ml-4">
                        <label className="text-gray-700 dark:text-gray-400">
                          Rôle (Update Role <i className="ri-edit-line ml-1" />)
                        </label>
                        <select
                          name="role"
                          value={records?.roles || ""}
                          onChange={handleRoleChange}
                          className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                        >
                          <option value="">Sélectionnez un rôle</option>
                          <option value="admin">Admin</option>
                          <option value="caissier">Caissier</option>
                        </select>
                      </div>
                      {/* <div className="ml-4">
                        <label className="text-gray-700 dark:text-gray-400">
                          Rôle (Update Role <i className="ri-edit-line ml-1" />)
                        </label>
                        <select
                          name="role"
                          value={records?.roles || ""}
                          onChange={handleRoleChange}
                          className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                        >
                          <option value="">Sélectionnez un rôle</option>
                          <option value="admin">Admin</option>
                          <option value="caissier">Caissier</option>
                        </select>
                      </div> */}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDetails;
