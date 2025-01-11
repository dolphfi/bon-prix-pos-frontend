import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

const Sidebar = () => {
  const [isPagesMenuOpen, setIsPagesMenuOpen] = useState(false);

  const togglePagesMenu = () => {
    setIsPagesMenuOpen(!isPagesMenuOpen);
  };

  return (
    <>
      {/* <!-- Desktop sidebar --> */}
      <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0">
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <a
            className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200"
            href="#"
          >
            Bon Prix
          </a>
          <ul className="mt-6">
            <li className="relative px-6 py-3">
              <span
                className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                aria-hidden="true"
              ></span>
              <Link
                className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100"
                to="/dashboard"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span className="ml-4">Dashboard</span>
              </Link>
            </li>
          </ul>
          <ul>
            <li className="relative px-6 py-3">
              <Link
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                to="/products"
              >
                <i className="fas fa-box" />
                <span className="ml-4">Products</span>
              </Link>
            </li>
            <li className="relative px-6 py-3">
              <Link
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                to="/sales"
              >
                <i className="fas fa-cash-register" />
                <span className="ml-4">Sales</span>
              </Link>
            </li>
            <li className="relative px-6 py-3">
              <Link
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                to="/reports"
              >
                <i className="fas fa-clipboard" />
                <span className="ml-4">Reports</span>
              </Link>
            </li>
            <li className="relative px-6 py-3">
              <button
                className="inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                onClick={togglePagesMenu}
                aria-haspopup="true"
              >
                <span className="inline-flex items-center">
                  <i className="fas fa-cog" />
                  <span className="ml-4">Setting</span>
                </span>
                <i className="fas fa-angle-down" />
              </button>
              <CSSTransition
                in={isPagesMenuOpen}
                timeout={300}
                classNames="submenu"
                unmountOnExit
              >
                <ul
                  className="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900"
                  aria-label="submenu"
                >
                  <li className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                    <Link className="w-full" to="/users">
                      <i className="fas fa-user" />
                      <span className="ml-4">Users</span>
                    </Link>
                  </li>
                  <li className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                    <a className="w-full" href="pages/create-account.html">
                      Create account
                    </a>
                  </li>
                </ul>
              </CSSTransition>
            </li>
          </ul>
          {/* <div className="px-6 my-6">
            <button className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
              Create account
              <span className="ml-2" aria-hidden="true">
                +
              </span>
            </button>
          </div> */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
