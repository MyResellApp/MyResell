import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
// import { useUser } from '@/context/UserContext'; // No se necesita user/subscription para tienda pública
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PackageSearch, AlertTriangle, Smartphone, Shirt, Sparkles as SparklesIcon, Filter, ShoppingCart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  const { toast } = useToast();
  // const navigate = useNavigate(); // No se usa por ahora

  const handleViewProductDetails = () => {
    toast({
      title: "🚧 Próximamente",
      description: "La vista detallada del producto estará disponible pronto.",
    });
    // navigate(`/product/${product.id}`); // Future implementation for product detail page
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
      <Card className="glass-effect h-full flex flex-col overflow-hidden hover:shadow-purple-500/30 transition-shadow duration-300">
        <div className="relative w-full h-56 overflow-hidden">
          <img  
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
            alt={product.name}
            src={product.image_url || "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=500&q=60"} />
        </div>
        <CardHeader className="pt-4 pb-2">
          <CardTitle className="text-xl font-semibold text-white truncate" title={product.name}>{product.name}</CardTitle>
          <CardDescription className="text-purple-400 text-sm">{product.category}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow pb-4">
          <p className="text-gray-400 text-sm mb-3 h-16 overflow-hidden">
            {product.description || "Descripción no disponible."}
          </p>
          {product.price && (
            <p className="text-lg font-bold text-green-400 mb-1">${product.price.toFixed(2)}</p>
          )}
        </CardContent>
        <div className="p-4 pt-0 grid grid-cols-2 gap-2">
          <Button onClick={handleViewProductDetails} variant="outline" className="w-full border-purple-600 text-purple-300 hover:bg-purple-700/30 hover:text-purple-200">
            Detalles
          </Button>
          <Button 
            onClick={() => {
              onAddToCart(product);
              toast({ title: "Producto Añadido", description: `${product.name} añadido al carrito (simulación).`});
            }} 
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90"
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Añadir
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

// Esta es la página PÚBLICA de productos (/products)
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Carrito (simulado por ahora)
  const [cart, setCart] = useState([]);
  const handleAddToCart = (product) => {
    setCart(prevCart => [...prevCart, product]);
    // En una implementación real, esto interactuaría con un contexto de carrito o localStorage
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
      setLoading(true);
      setError(null);

      // Para la tienda pública, no se requiere suscripción.
      // La política RLS de Supabase para 'products' debe permitir lectura pública.
      let query = supabase.from('products').select('*');
      
      // Si hubiera una columna para diferenciar productos de tienda vs. catálogo de proveedores:
      // query = query.eq('product_type', 'public_store'); 

      if (selectedCategory !== 'Todos') {
        query = query.eq('category', selectedCategory);
      }
      query = query.order('created_at', { ascending: false });

      const { data, error: dbError } = await query;

      if (dbError) {
        console.error('Error fetching public products:', dbError);
        setError('No se pudieron cargar los productos. Inténtalo de nuevo más tarde.');
        toast({ title: "Error de Carga", description: dbError.message, variant: "destructive" });
      } else {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [selectedCategory, toast]);
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    navigate(`/products?category=${category === 'Todos' ? '' : category}`, { replace: true });
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
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
          <ShoppingCart className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-3">Nuestra Tienda</h1>
          <p className="text-xl text-gray-300">
            Explora nuestra selección de productos disponibles para compra directa.
          </p>
        </div>
        
        {/* Simulación de Carrito - Placeholder */}
        {cart.length > 0 && (
          <div className="fixed bottom-4 right-4 glass-effect p-4 rounded-lg shadow-xl z-50 w-72">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-purple-300"/> Carrito ({cart.length})
            </h3>
            <ul className="text-sm text-gray-300 max-h-32 overflow-y-auto mb-2">
              {cart.slice(0,3).map((item, index) => <li key={index} className="truncate">- {item.name}</li>)}
              {cart.length > 3 && <li>... y {cart.length - 3} más</li>}
            </ul>
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 text-sm"
              onClick={() => toast({title: "Checkout (Simulado)", description: "La funcionalidad de checkout del carrito está en desarrollo."})}
            >
              Checkout (Simulado)
            </Button>
          </div>
        )}


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
            <h2 className="text-2xl font-semibold mb-2 text-yellow-300">Error al Cargar Productos</h2>
            <p className="text-gray-300 mb-6">{error}</p>
          </div>
        )}

        {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
            </div>
        ) : products.length === 0 && !error ? (
            <div className="text-center text-gray-400 text-lg glass-effect p-8 rounded-xl">
              <PackageSearch className="h-12 w-12 mx-auto mb-4 text-purple-400" />
              No hay productos disponibles en la categoría "{selectedCategory}" por el momento.
            </div>
        ) : products.length > 0 && !error && (
            <motion.div 
              layout 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProductsPage;