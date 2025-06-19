import React from 'react';
import { UserProvider } from '@/context/UserContext';
import AppRouter from '@/routes';
import { Toaster } from '@/components/ui/toaster'; // Keep a global Toaster if needed, or rely on MainLayout's.

function App() {
  return (
    <UserProvider>
      <AppRouter />
      <Toaster /> {/* This ensures toasts can be called from anywhere, even outside MainLayout, though typically placed there. */}
    </UserProvider>
  );
}

export default App;