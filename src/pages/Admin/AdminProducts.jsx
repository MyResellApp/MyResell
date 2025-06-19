
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Asumiendo que tienes este componente
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Asumiendo
import { useToast } from '@/components/ui/use-toast';
import { Loader2, PlusCircle, Edit, Trash2, PackageSearch, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";


const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // For editing
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    image_url: '',
    supplier_info: '',
    // stripe_price_id: '', // Si los productos de tienda también se venden por suscripción o tienen precios Stripe
  });
  const { toast } = useToast();
  const categories = ['Electrónica', 'Moda', 'Perfumes']; // Consistent categories

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) {
      toast({ title: "Error", description: "No se pudieron cargar los productos.", variant: "destructive" });
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', category: '', price: '', image_url: '', supplier_info: '' });
    setCurrentProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
        toast({ title: "Campos requeridos", description: "Nombre, categoría y precio son obligatorios.", variant: "destructive"});
        return;
    }

    setLoading(true);
    let error;
    if (currentProduct) { // Editing
      const { error: updateError } = await supabase.from('products').update(formData).eq('id', currentProduct.id);
      error = updateError;
    } else { // Creating
      const { error: insertError } = await supabase.from('products').insert(formData);
      error = insertError;
    }

    if (error) {
      toast({ title: "Error", description: `Error al ${currentProduct ? 'actualizar' : 'crear'} producto: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Éxito", description: `Producto ${currentProduct ? 'actualizado' : 'creado'} correctamente.` });
      setIsModalOpen(false);
      resetForm();
      fetchProducts(); // Refresh list
    }
    setLoading(false);
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      price: product.price || '',
      image_url: product.image_url || '',
      supplier_info: product.supplier_info || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) return;
    setLoading(true);
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      toast({ title: "Error", description: `Error al eliminar producto: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Éxito", description: "Producto eliminado correctamente." });
      fetchProducts(); // Refresh list
    }
    setLoading(false);
  };
  
  // Fallback for Textarea if not available
  const TextareaComponent = Textarea || ((props) => <textarea {...props} className="w-full p-2 border rounded bg-slate-700 border-slate-600" />);
  // Fallback for Select if not available
  const SelectTriggerComponent = SelectTrigger || ((props) => <button type="button" {...props} className="w-full p-2 border rounded text-left bg-slate-700 border-slate-600" />);
  const SelectValueComponent = SelectValue || ((props) => <span {...props} />);


  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestionar Productos</h1>
          <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-purple-600 hover:bg-purple-700">
            <PlusCircle className="mr-2 h-5 w-5" /> Añadir Producto
          </Button>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">{currentProduct ? 'Editar' : 'Añadir Nuevo'} Producto</DialogTitle>
              <DialogDescription>
                {currentProduct ? 'Modifica los detalles del producto.' : 'Completa la información del nuevo producto.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right col-span-1">Nombre</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3 bg-slate-700 border-slate-600" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right col-span-1">Descripción</Label>
                <TextareaComponent id="description" name="description" value={formData.description} onChange={handleInputChange} className="col-span-3 bg-slate-700 border-slate-600" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right col-span-1">Categoría</Label>
                <Select onValueChange={handleCategoryChange} value={formData.category} name="category">
                    <SelectTriggerComponent id="category" className="col-span-3 bg-slate-700 border-slate-600">
                        <SelectValueComponent placeholder="Selecciona categoría" />
                    </SelectTriggerComponent>
                    <SelectContent className="bg-slate-700 text-white border-slate-600">
                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right col-span-1">Precio</Label>
                <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} className="col-span-3 bg-slate-700 border-slate-600" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image_url" className="text-right col-span-1">URL Imagen</Label>
                <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleInputChange} className="col-span-3 bg-slate-700 border-slate-600" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supplier_info" className="text-right col-span-1">Info Proveedor</Label>
                <Input id="supplier_info" name="supplier_info" value={formData.supplier_info} onChange={handleInputChange} className="col-span-3 bg-slate-700 border-slate-600" />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {currentProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {loading && products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          </div>
        ) : !loading && products.length === 0 ? (
          <div className="text-center py-12 glass-effect rounded-lg">
            <PackageSearch className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <p className="text-xl text-gray-400">No hay productos para mostrar.</p>
            <p className="text-sm text-gray-500">Empieza añadiendo tu primer producto.</p>
          </div>
        ) : (
          <div className="overflow-x-auto glass-effect rounded-lg p-0.5">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Categoría</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Precio</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Proveedor</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-slate-800/30 divide-y divide-slate-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 truncate max-w-xs">{product.supplier_info || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(product)} className="text-blue-400 hover:text-blue-300">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
