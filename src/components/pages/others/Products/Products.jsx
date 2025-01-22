/*eslint-disable*/
import React, { useEffect, useState } from "react";
import Header from "../../../includes/Header";
import Sidebar from "../../../includes/Sidebar";
import Footer from "../../../includes/Footer";
import { ProductsTable } from "../../../data/dataTable";
import { ProductsForm } from "../../../Jobs/Form";

const Products = () => {
  const isSideMenuOpen = true; // Exemple de valeur dynamique
  const [isModalOpen, setModalOpen] = useState(false); // État pour le modal
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    document.title = "Bon Prix | Products";
  }, []);

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

          {/* Products start*/}
          <main className="h-full overflow-y-auto">
            <div className="container px-6 mx-auto grid">
              <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Products
              </h2>
              <div className="flex justify-end items-end">
                {/* Bouton pour ouvrir le modal */}
                <button
                  onClick={openModal}
                  className="px-3 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                >
                  <i className="ri-add-box-fill" />
                </button>
              </div>
              {/* <!-- Cards --> */}
              <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4"></div>
              {/* <!-- New Table --> */}
              <ProductsTable />
            </div>
          </main>
          <Footer />
        </div>
        {/* Ajoutez ici vos éléments enfants */}
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
                Add a new Products
              </p>
              <ProductsForm closeModal={closeModal} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Products;
