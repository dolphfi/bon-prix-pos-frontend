/*eslint-disable*/
import React, { useState } from "react";
import Sidebar from "../../../includes/Sidebar";
import Header from "../../../includes/Header";
import Footer from "../../../includes/Footer";

const tableData = [
  {
    client: "Hans Burger",
    amount: "$863.45",
    status: "Approved",
    date: "6/10/2020",
  },
  {
    client: "Jolina Angelie",
    amount: "$369.95",
    status: "Pending",
    date: "6/10/2020",
  },
  {
    client: "Sarah Curry",
    amount: "$86.00",
    status: "Denied",
    date: "6/10/2020",
  },
  {
    client: "Rulia Joberts",
    amount: "$1276.45",
    status: "Approved",
    date: "6/10/2020",
  },
  {
    client: "Wenzel Dashington",
    amount: "$863.45",
    status: "Expired",
    date: "6/10/2020",
  },
  {
    client: "Fidele Burger",
    amount: "$863.45",
    status: "Approved",
    date: "6/10/2020",
  },
  // Ajoute plus de données si nécessaire
];
const Reports = () => {
  const isSideMenuOpen = true; // Exemple de valeur dynamique
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Nombre d'éléments par page

  // Calculer les indices de début et de fin
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  /**
   * @param {number} page
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
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

        {/* Reports start*/}
        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto grid">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Reports
            </h2>
            {/* <!-- Cards --> */}
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4"></div>
            {/* <!-- New Table --> */}
            <div className="w-full overflow-hidden rounded-lg shadow-xs">
              <div className="w-full overflow-x-auto">
                <table className="w-full whitespace-no-wrap">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {currentItems.map((item, index) => (
                      <tr
                        key={index}
                        className="text-gray-700 dark:text-gray-400"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center text-sm">
                            <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                              <img
                                className="object-cover w-full h-full rounded-full"
                                src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                                alt=""
                                loading="lazy"
                              />
                            </div>
                            <div>
                              <p className="font-semibold">{item.client}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                10x Developer
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{item.amount}</td>
                        <td className="px-4 py-3 text-xs">
                          <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                  <span className="flex items-center col-span-3">
                    Showing {indexOfFirstItem + 1}-{indexOfLastItem} of{" "}
                    {tableData.length}
                  </span>
                  <span className="col-span-2"></span>
                  <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                    <nav aria-label="Table navigation">
                      <ul className="inline-flex items-center">
                        <li>
                          <button
                            className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                            aria-label="Previous"
                            onClick={() =>
                              currentPage > 1 &&
                              handlePageChange(currentPage - 1)
                            }
                          >
                            <svg
                              aria-hidden="true"
                              className="w-4 h-4 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                                fill-rule="evenodd"
                              ></path>
                            </svg>
                          </button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                          <li key={index}>
                            <button
                              className={`px-3 py-1 rounded-md ${
                                currentPage === index + 1
                                  ? "bg-purple-600 text-white"
                                  : ""
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
                            <svg
                              className="w-4 h-4 fill-current"
                              aria-hidden="true"
                              viewBox="0 0 20 20"
                            >
                              <path
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd"
                                fill-rule="evenodd"
                              ></path>
                            </svg>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
      {/* Ajoutez ici vos éléments enfants */}
    </div>
  );
};

export default Reports;
