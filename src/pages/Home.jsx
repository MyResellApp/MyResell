import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import CategoriesSection from '@/components/sections/CategoriesSection';
import PricingSection from '@/components/sections/PricingSection';
import CommunitySection from '@/components/sections/CommunitySection';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const showFeatureToast = (message) => {
    toast({
      title: message || "🚧 Esta función aún no está implementada",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀",
    });
  };
  
  const handlePricingNavigation = () => {
    navigate('/pricing');
  };

  return (
    <>
      <HeroSection showFeatureToast={() => navigate('/register')} />
      <StatsSection />
      <CategoriesSection showFeatureToast={() => showFeatureToast("Explorar categorías está en desarrollo.")} />
      <PricingSection showFeatureToast={handlePricingNavigation} />
      <CommunitySection showFeatureToast={() => showFeatureToast("La comunidad premium llegará pronto.")} />
    </>
  );
};

export default Home;