import React from 'react'
// import PrivateRoute from "../utils/PrivateRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from '../pages/Dashboard';
import Login from '../auth/Login';
import Products from '../pages/others/Products';
import Carts from '../pages/others/Carts';
import Reports from '../pages/others/Reports';
import Sales from '../pages/others/Sales';
import Users from '../pages/others/Users';

function AppRoutes() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* Vous pouvez définir vos routes ici */}
                    <Route path='/' element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path='/carts' element={<Carts />} />
                    <Route path='/reports' element={<Reports />} />
                    <Route path='/sales' element={<Sales />} />
                    <Route path='/users' element={<Users />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default AppRoutes
