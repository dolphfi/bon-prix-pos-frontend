// network.js
const checkNetworkStatus = () => {
    return navigator.onLine;
};

// Event listener to detect online status
window.addEventListener('online', () => {
    console.log('Vous êtes connecté à Internet.');
});

// Event listener to detect offline status
window.addEventListener('offline', () => {
    console.log('Vous êtes hors ligne.');
});

// Export the function for reuse
export default checkNetworkStatus;
