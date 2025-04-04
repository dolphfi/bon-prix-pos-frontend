import { ToastContainer } from "react-toastify";
import AppRoutes from "./components/routes/Routes";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <AppRoutes />
    </>
  );
}

export default App;
