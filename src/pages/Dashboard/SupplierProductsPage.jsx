
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PackageSearch, AlertTriangle, Smartphone, Shirt, Sparkles as SparklesIcon, Filter, Lock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { toast } = useToast();

  const handleViewProduct = () => {
    toast({
      title: "🚧 Próximamente",
      description: "La vista detallada del producto y opciones de contacto con proveedor estarán disponibles pronto.",
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="glass-effect h-full flex flex-col overflow-hidden hover:shadow-purple-500/30 transition-shadow duration-300 border-purple-600/50">
        <div className="relative w-full h-56 overflow-hidden">
          <img  
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
            alt={product.name}
            src={product.image_url || "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=500&q=60"} />
        </div>
        <CardHeader className="pt-4 pb-2">
          <CardTitle className="text-xl font-semibold text-white truncate" title={product.name}>{product.name}</CardTitle>
          <CardDescription className="text-purple-300 text-sm">{product.category}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow pb-4">
          <p className="text-gray-400 text-sm mb-3 h-16 overflow-hidden">
            {product.description || "Descripción no disponible."}
          </p>
          {product.price && (
            <p className="text-lg font-bold text-green-400 mb-1">Precio Guía: ${product.price.toFixed(2)}</p>
          )}
          {product.supplier_info && (
            <p className="text-xs text-gray-500 truncate">Proveedor: {product.supplier_info}</p>
          )}
        </CardContent>
        <div className="p-4 pt-0">
          <Button onClick={handleViewProduct} className="w-full bg-purple-600 hover:bg-purple-700">
            Ver Detalles del Proveedor
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

// Esta página es para los productos de proveedores, accesible solo para suscriptores.
// La página pública /products usa ProductsPage.jsx
const SupplierProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, activeSubscription, loading: userLoading } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const categories = ['Todos', 'Electrónica', 'Moda', 'Perfumes'];
   const categoryIcons = {
    'Todos': Filter,
    'Electrónica': Smartphone,
    'Moda': Shirt,
    'Perfumes': SparklesIcon,
  };


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (userLoading) return; 

      setLoading(true);
      setError(null);

      if (!user || !activeSubscription || activeSubscription.status !== 'active') {
        setError("Necesitas una suscripción activa para ver los productos de proveedores.");
        toast({
            title: "Acceso Restringido",
            description: "Por favor, activa una suscripción para ver nuestro catálogo de proveedores.",
            variant: "destructive",
            action: <Button onClick={() => navigate('/pricing')}>Ver Planes</Button>
        });
        setLoading(false);
        setProducts([]);
        return;
      }

      // Asumimos que los productos de proveedores podrían tener una columna 'is_supplier_product' = true
      // o que todos los productos en la tabla 'products' son de proveedores si la política RLS lo permite.
      // Por ahora, filtramos igual que la página pública, pero la RLS de Supabase debería
      // restringir el acceso si esta página está bajo /dashboard y la política es estricta.
      // Si la tabla 'products' tiene una columna para diferenciar (ej. 'type' = 'supplier' o 'public_store'),
      // se usaría aquí. Para este ejemplo, se asume que todos los productos son de proveedores.
      let query = supabase.from('products').select('*');
      
      // Ejemplo: si tuvieras una columna 'product_type'
      // query = query.eq('product_type', 'supplier_catalog'); 

      if (selectedCategory !== 'Todos') {
        query = query.eq('category', selectedCategory);
      }
      query = query.order('created_at', { ascending: false });

      const { data, error: dbError } = await query;

      if (dbError) {
        console.error('Error fetching supplier products:', dbError);
        setError('No se pudieron cargar los productos de proveedores. Inténtalo de nuevo más tarde.');
        toast({ title: "Error de Carga", description: dbError.message, variant: "destructive" });
      } else {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [user, activeSubscription, userLoading, selectedCategory, toast, navigate]);
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    navigate(`/dashboard/suppliers?category=${category === 'Todos' ? '' : category}`, { replace: true });
  };

  if (userLoading || (loading && products.length === 0 && !error)) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
      </div>
    );
  }
  
  if (!userLoading && (!user || !activeSubscription || activeSubscription.status !== 'active')) {
     return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center glass-effect p-10 rounded-xl"
        >
          <Lock className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4 text-yellow-300">Acceso Premium Requerido</h1>
          <p className="text-xl text-gray-300 mb-8">
            Esta sección es exclusiva para nuestros miembros con suscripción activa.
          </p>
          <Button size="lg" onClick={() => navigate('/pricing')} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-3 neon-glow">
            Ver Planes de Suscripción
          </Button>
        </motion.div>
      </div>
    );
  }


  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <PackageSearch className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-3">Proveedores Exclusivos</h1>
          <p className="text-xl text-gray-300">
            Accede a nuestro catálogo curado de proveedores para tu negocio.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-4">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat];
            return (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => handleCategoryChange(cat)}
                className={`
                  ${selectedCategory === cat 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent' 
                    : 'text-purple-300 border-purple-700 hover:bg-purple-800/30 hover:text-purple-200'}
                  transition-all duration-300 ease-in-out transform hover:scale-105
                `}
              >
                <Icon className="mr-2 h-4 w-4" />
                {cat}
              </Button>
            );
          })}
        </div>
        
        {error && (
          <div className="flex flex-col items-center justify-center text-center glass-effect p-8 rounded-xl">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-yellow-300">Error</h2>
            <p className="text-gray-300 mb-6">{error}</p>
          </div>
        )}

        {loading && products.length === 0 && !error ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
            </div>
        ) : !loading && products.length === 0 && !error ? (
            <div className="text-center text-gray-400 text-lg glass-effect p-8 rounded-xl">
              <PackageSearch className="h-12 w-12 mx-auto mb-4 text-purple-400" />
              No hay productos de proveedores en la categoría "{selectedCategory}" por el momento.
            </div>
        ) : products.length > 0 && !error && (
            <motion.div 
              layout 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SupplierProductsPage;
