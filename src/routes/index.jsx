
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';
import AdminRoute from '@/routes/AdminRoute'; // Nueva ruta protegida para admin

import Home from '@/pages/Home';
import About from '@/pages/About';
import PricingPage from '@/pages/PricingPage';
import ProductsPage from '@/pages/ProductsPage'; // Tienda pública de productos
import Contact from '@/pages/Contact';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Register from '@/pages/Auth/Register';
import Login from '@/pages/Auth/Login';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Profile from '@/pages/Dashboard/Profile';
import SupplierProductsPage from '@/pages/Dashboard/SupplierProductsPage'; // Productos para revendedores (premium)
import Checkout from '@/pages/Payment/Checkout';
import Success from '@/pages/Payment/Success';
import Cancel from '@/pages/Payment/Cancel';
import NotFound from '@/pages/NotFound';

// Admin Pages
import AdminDashboard from '@/pages/Admin/AdminDashboard';
import AdminProducts from '@/pages/Admin/AdminProducts';
import AdminOrders from '@/pages/Admin/AdminOrders';
import AdminUsers from '@/pages/Admin/AdminUsers';
import AdminSettings from '@/pages/Admin/AdminSettings';


const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'pricing', element: <PricingPage /> },
      { path: 'products', element: <ProductsPage /> }, // Tienda pública
      { path: 'contact', element: <Contact /> },
      { path: 'terms', element: <Terms /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },
      { path: 'checkout/:planId', element: <Checkout /> },
      { path: 'payment/success', element: <Success /> },
      { path: 'payment/cancel', element: <Cancel /> },
      {
        path: 'dashboard',
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'profile', element: <Profile /> },
          { path: 'suppliers', element: <SupplierProductsPage /> }, // Productos para revendedores (premium)
        ],
      },
      {
        path: 'admin',
        element: <AdminRoute />, // Ruta protegida para administradores
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'products', element: <AdminProducts /> },
          { path: 'orders', element: <AdminOrders /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'settings', element: <AdminSettings /> },
        ]
      },
      { path: '*', element: <NotFound /> } 
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
import ProductosPage from '@/pages/ProductosPage';

<Route path="/productos" element={<ProductosPage />} />
import ProductosPage from '@/pages/ProductosPage';

<Route path="/productos" element={<ProductosPage />} />
import ProductosPage from '@/pages/ProductosPage';

<Route path="/productos" element={<ProductosPage />} />
