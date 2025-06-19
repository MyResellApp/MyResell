import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

const MainLayout = () => {
  const { toast } = useToast();
  
  const showFeatureToast = (customMessage) => {
    toast({
      title: customMessage || "🚧 Esta función aún no está implementada",
      description: "¡No te preocupes! Puedes solicitarla en tu próximo prompt! 🚀"
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-foreground">
      <Toaster />
      <Navbar showFeatureToast={showFeatureToast} />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer showFeatureToast={showFeatureToast} />
    </div>
  );
};

export default MainLayout;