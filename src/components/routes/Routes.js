import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Login from '../auth/Login';
import Products from '../pages/others/Products/Products';
import Users from '../pages/others/Users/Users';
import NotFound from '../errors/NotFound';
import { AuthProvider } from '../context/AuthContext';
import PrivateRoute from '../utils/PrivateRoute';
import UserDetails from '../pages/others/Users/UserDetails';
import { ForgotPassword } from '../auth/ForgotPassword';
import { ResetPassword } from '../auth/ResetPassword';
import Profile from '../auth/Profile';
import Carts from '../pages/others/Sales/Carts';
import Reports from '../pages/others/Reports/Reports';
import Sales from '../pages/others/Sales/Sales';

function AppRoutes() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Route publique */}
                    <Route path='/' element={<Login />} />
                    <Route path='/forgot_password' element={<ForgotPassword />} />
                    <Route path='/reset_password' element={<ResetPassword />} />

                    {/* Route privée */}
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                    />
                    <Route path="/products" element={
                        <PrivateRoute>
                            <Products />
                        </PrivateRoute>
                    }
                    />
                    <Route path="/carts" element={
                        <PrivateRoute>
                            <Carts />
                        </PrivateRoute>
                    }
                    />
                    <Route path='/reports' element={
                        <PrivateRoute>
                            <Reports />
                        </PrivateRoute>
                    } />
                    <Route path='/Sales' element={
                        <PrivateRoute>
                            <Sales />
                        </PrivateRoute>
                    } />
                    <Route path='/Users' element={
                        <PrivateRoute>
                            <Users />
                        </PrivateRoute>
                    } />
                    <Route path='/detail-user/:id' element={<PrivateRoute>
                        <UserDetails />
                    </PrivateRoute>} />
                    <Route path='/profile' element={<PrivateRoute>
                        <Profile />
                    </PrivateRoute>} />


                    {/* Route pour la page non trouvée */}
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
export default AppRoutes;  // Exporter la fonction AppRoutes
