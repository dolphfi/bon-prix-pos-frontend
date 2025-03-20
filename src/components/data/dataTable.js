import { useContext, useEffect, useState } from "react";
import { UrlPhoto } from "../public/BaseUrls";
import Loader from '../includes/loader/Loader';
import Prod from "../context/ProductsContext";
import { Link } from "react-router-dom";
// import { Bounce, toast } from "react-toastify";
import { UpdateProductsForm } from "../Jobs/Form";

export const ProductsTable = () => {
    const { getAllProducts,
        // deleteProduct,
    } = useContext(Prod)
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Nombre d'éléments par page
    const baseUrlPhoto = UrlPhoto;
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false); // État pour le modal
    // const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllProducts();
                console.log("Données récupérées :", data); // Vérifiez ici
                setRecords(data);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors du chargement des données :", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [getAllProducts]);

    // Filtrer les données avec plusieurs champs
    const filteredData = Array.isArray(records)
        ? records.filter((item) =>
            [item.name].some((field) =>
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

    // const handleDelete = async (id) => {
    //     try {
    //         await deleteProduct(id);
    //         await refreshData();
    //         toast.success('Product delete successfully', {
    //             position: "top-right",
    //             autoClose: 5000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             theme: "light",
    //             transition: Bounce,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };
    // const refreshData = async () => {
    //     try {
    //         const data = await getAllProducts(); // Assure-toi que `getAllUsers()` est bien une fonction dans ton context
    //         setRecords(data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };
    const handleEditClick = (item) => {
        setSelectedProduct(item);
        setModalOpen(true);
    };

    return (
        <>
            {/* Barre de recherche */}
            <div className="mb-4 w-64">
                <input
                    type="text"
                    className="w-full px-4 py-2 text-sm text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    placeholder="Search by Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="w-full overflow-hidden rounded-lg shadow-xs">
                <div className="w-full overflow-x-auto">
                    <table className="w-full whitespace-no-wrap">
                        <thead>
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                <th className="px-4 py-3">Product</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Quantity</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Discount</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                            {currentItems.length > 0 ? (
                                currentItems.map((item) => (
                                    <tr key={item.id} className="text-gray-700 dark:text-gray-400">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center text-sm">
                                                <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                                                    <img className="object-cover w-full h-full rounded-full"
                                                        src={`${baseUrlPhoto}${item.image}`} alt="" loading="lazy" />
                                                    <div className="absolute inset-0 rounded-full shadow-inner"
                                                        aria-hidden="true"></div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">
                                                        {item.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{item.price}</td>
                                        <td className="px-4 py-3 text-sm">{item.description}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center text-sm">
                                                <div>
                                                    <p className="font-semibold">
                                                        {item.stock}
                                                    </p>
                                                    <p className="text-xs">
                                                        <span className={`text-xs ${item.stock <= 10 ? 'text-red-700' : 'text-green-700'} rounded-full`}>
                                                            {item.stock <= 10 ? 'Low Stock' : 'In Stock'}
                                                        </span>
                                                    </p>

                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            <span
                                                className={`px-2 py-1 font-semibold leading-tight ${item.isActive
                                                    ? "text-green-700 bg-green-100"
                                                    : "text-red-700 bg-red-100"
                                                    } rounded-full`}
                                            >
                                                {item.isActive ? "Available" : "Unavailable"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{item.category}</td>
                                        <td className="px-4 py-3 text-sm">{item.discount}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    to={`/detail-product/${item.id}`}
                                                    className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                                                    title="Voir les détails"
                                                >
                                                    <i className="ri-eye-line" />
                                                </Link>
                                                {/* Bouton Delete */}
                                                {/* |
                                                <button
                                                    className='flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray '
                                                    onClick={() => handleDelete(item.id)}
                                                    title="Delete product"
                                                >

                                                    <i className="ri-delete-bin-line" />
                                                </button> */}
                                                |
                                                <button
                                                    onClick={() => handleEditClick(item)}
                                                    className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                                                    title="Edit Stock">
                                                    <i className="ri-pencil-line" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
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
                                            className={`px-3 py-1 rounded-md ${currentPage === index + 1
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
                            <UpdateProductsForm
                                item={selectedProduct} // Passez le produit sélectionné 
                                onClose={() => setModalOpen(false)} // Permet de fermer le modal après la mise à jour 
                            />
                        </div>
                    </div>
                </div>
            )}
        </>

    );
};