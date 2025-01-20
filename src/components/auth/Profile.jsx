import React from "react";
import Header from "../includes/Header";
import Sidebar from "../includes/Sidebar";

const Profile = () => {
  const isSideMenuOpen = true; // Exemple de valeur dynamique
  return (
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${
        isSideMenuOpen ? "overflow-hidden" : ""
      }`}
    >
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />

        {/* Sales start*/}
        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto grid">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Update Profile
            </h2>
            {/* <!-- Cards --> */}
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4"></div>
          </div>
        </main>
      </div>
      {/* Ajoutez ici vos éléments enfants */}
    </div>
  );
};

export default Profile;
