import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Auth from "../context/AuthContext";
import { UrlPhoto } from "../public/BaseUrls";
import Loader from "../includes/loader/Loader";

const UserData = () => {
  const { getAllUsers, toggleUserActivation } = useContext(Auth);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const baseUrlPhoto = UrlPhoto;

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllUsers();
        console.log("Données récupérées :", data); // Vérifiez ici
        setRecords(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [getAllUsers]);

  // Filtrer les données avec plusieurs champs
  const filteredData = Array.isArray(records)
    ? records.filter((item) =>
        [item.username, item.roles].some((field) =>
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleActivateDeactivate = async (id) => {
    try {
      await toggleUserActivation(id);
      await refreshData();
    } catch (error) {
      console.error(error);
    }
  };
  const refreshData = async () => {
    try {
      const data = await getAllUsers(); // Assure-toi que `getAllUsers()` est bien une fonction dans ton context
      setRecords(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Barre de recherche */}
      <div className="mb-4 w-64">
        <input
          type="text"
          className="w-full px-4 py-2 text-sm text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          placeholder="Search by username or roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr
                    key={item.id}
                    className="text-gray-700 dark:text-gray-400"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                          <img
                            className="object-cover w-full h-full rounded-full"
                            src={`${baseUrlPhoto}${item.photo}`}
                            alt=""
                            loading="lazy"
                          />
                          <div
                            className="absolute inset-0 rounded-full shadow-inner"
                            aria-hidden="true"
                          ></div>
                        </div>
                        <div>
                          <p className="font-semibold">
                            {item.nom} {item.prenom}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {item.roles}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{item.username}</td>
                    <td className="px-4 py-3 text-xs">
                      <span
                        className={`px-2 py-1 font-semibold leading-tight ${
                          item.isActive
                            ? "text-green-700 bg-green-100"
                            : "text-red-700 bg-red-100"
                        } rounded-full`}
                      >
                        {item.isActive ? "Activated" : "Deactivated"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{item.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {/* Bouton Voir */}
                        <Link
                          to={`/detail-user/${item.id}`}
                          className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                          title="Voir les détails"
                        >
                          <i className="ri-eye-line" />
                        </Link>
                        {/* Bouton Activer/Désactiver */}|
                        <button
                          className={`flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray ${
                            item.isActive ? "btn-danger" : "btn-success"
                          }`}
                          onClick={() => handleActivateDeactivate(item.id)}
                        >
                          {item.isActive ? (
                            <i className="ri-user-follow-line" />
                          ) : (
                            <i class="ri-user-unfollow-line" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    {loading ? <Loader /> : <>Aucun donnée disponible.</>}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="w-full border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="px-4 py-3 flex items-center justify-between text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            <span>
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredData.length)} of{" "}
              {filteredData.length}
            </span>
            <nav aria-label="Table navigation" className="flex">
              <ul className="inline-flex items-center space-x-1">
                <li>
                  <button
                    className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                    aria-label="Previous"
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                  >
                    &lt;
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index}>
                    <button
                      className={`px-3 py-1 rounded-md ${
                        currentPage === index + 1
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                    aria-label="Next"
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
                    }
                  >
                    &gt;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserData;
