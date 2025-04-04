import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto">
        <div className="flex flex-col items-center">
          <div className="flex">
            <span className="text-lg font-semibold text-gray-700 text-center dark:text-gray-300">
              RC Multi services
            </span>
          </div>

          <div className="flex flex-wrap text-xs border-t w-full py-2 items-center">
            <div className="flex-1">
              <a
                href="#privacy"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200 px-3 py-1"
              >
                Politique de confidentialité
              </a>
              <a
                href="#terms"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200 px-3 py-1"
              >
                Conditions d'utilisation
              </a>
            </div>
            <div className="flex justify-center w-full sm:w-auto sm:justify-start">
              <div className="text-xs text-gray-600 dark:text-gray-400 ">
                <span>&copy; {currentYear} </span>
                <span className="mx-1">Développé par </span>
                <a
                  href="https://kolabotech.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200"
                >
                  KOLABO TECH
                </a>
              </div>
            </div>
          </div>


        </div>
      </div>
    </footer>
  );
};

export default Footer;
