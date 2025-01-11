import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const Login = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  // Charger le mode à partir de localStorage lorsque le composant se charge
  useEffect(() => {
    const savedMode = localStorage.getItem("theme-dark");
    if (savedMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("theme-dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("theme-dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Simulation de chargement de page (exemple : 2 secondes)
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="loader-containerh">
          <div className="loaderh"></div>
          <img
            src="../assets/img/bon1.png"
            style={{ width: "70px", height: "70px" }}
            alt="Logo"
            className="loader-logo"
          />
        </div>
      ) : (
        <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
          <div className="flex-1 h-full max-w-xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
            <div className="flex flex-col overflow-y-auto ">
              {/* md:flex-row */}
              <div className="flex p-6 sm:p-12">
                <div className="w-full">
                  <img
                    className="object-cover w-56 h-auto logo"
                    src="../assets/img/bon.png"
                    alt="Logo"
                  />
                  <label className="block text-sm">
                    <span className="text-gray-700 dark:text-gray-400">
                      Email
                    </span>
                    <input
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                      placeholder="Jane Doe"
                    />
                  </label>
                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">
                      Password
                    </span>
                    <input
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                      placeholder="***************"
                      type="password"
                    />
                  </label>
                  <RouterLink
                    className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                    to="/dashboard"
                  >
                    Log in
                  </RouterLink>

                  <hr className="my-8" />

                  <p className="mt-4 mleft mtop">
                    <RouterLink
                      className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                      to="/forgot_password"
                    >
                      Forgot your password?{" "}
                    </RouterLink>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
