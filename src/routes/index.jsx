import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';
import AdminRoute from '@/routes/AdminRoute';

import Home from '@/pages/Home';
import About from '@/pages/About';
import PricingPage from '@/pages/PricingPage';
import ProductsPage from '@/pages/ProductsPage';
import Contact from '@/pages/Contact';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Register from '@/pages/Auth/Register';
import Login from '@/pages/Auth/Login';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Profile from '@/pages/Dashboard/Profile';
import SupplierProductsPage from '@/pages/Dashboard/SupplierProductsPage';
import Checkout from '@/pages/Payment/Checkout';
import Success from '@/pages/Payment/Success';
import Cancel from '@/pages/Payment/Cancel';
import NotFound from '@/pages/NotFound';

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
      { path: 'products', element: <ProductsPage /> },         // En inglés
      { path: 'productos', element: <ProductsPage /> },        // Opcional en español
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
          { path: 'suppliers', element: <SupplierProductsPage /> },
        ],
      },
      {
        path: 'admin',
        element: <AdminRoute />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'products', element: <AdminProducts /> },
          { path: 'orders', element: <AdminOrders /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'settings', element: <AdminSettings /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
