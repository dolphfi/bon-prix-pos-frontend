/*eslint-disable*/
import React, { useEffect, useState } from "react";
import UserData from "../../../data/UserData";
import Sidebar from "../../../includes/Sidebar";
import Header from "../../../includes/Header";
import { UsersForm } from "../../../Jobs/Form";
import Footer from "../../../includes/Footer";

const Users = () => {
  const [isModalOpen, setModalOpen] = useState(false); // État pour le modal
  const isSideMenuOpen = true;

  useEffect(() => {
    document.title = "Bon Prix | Users";
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
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
                Users
              </h2>
              <div className="flex justify-end items-end">
                {/* Bouton pour ouvrir le modal */}
                <button
                  onClick={openModal}
                  className="px-3 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                >
                  <i className="ri-user-add-line" />
                </button>
              </div>

              {/* données utilisateur */}
              <UserData />
            </div>
          </main>
          <Footer />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          onClick={closeModal} // Fermer le modal en cliquant sur l'arrière-plan
          className="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
        >
          {/* Contenu du modal */}
          <div
            onClick={(e) => e.stopPropagation()} // Empêche la fermeture en cliquant à l'intérieur du modal
            className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl"
          >
            {/* En-tête du modal */}
            <header className="flex justify-end">
              <button
                onClick={closeModal}
                className="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover:text-gray-700"
                aria-label="close"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  role="img"
                  aria-hidden="true"
                >
                  <path
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </button>
            </header>

            {/* Corps du modal */}
            <div className="mt-4 mb-6">
              <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                Add a new user
              </p>
              {/* <p className="text-sm text-gray-700 dark:text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Nostrum et eligendi repudiandae voluptatem tempore!
              </p> */}
              <UsersForm closeModal={closeModal} />
            </div>

            {/* Pied de page du modal */}
            {/* <footer className="flex flex-col items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-4 sm:space-y-0 sm:space-x-6 sm:flex-row bg-gray-50 dark:bg-gray-800">
              <button className="flex items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                <span>Save</span>
                <i className="ri-save-line w-4 h-4 ml-2 -mr-1" />
              </button>
            </footer> */}
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
