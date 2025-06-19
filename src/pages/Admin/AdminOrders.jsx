
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, FileText, AlertTriangle, Edit, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label'; // Importación añadida

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const { toast } = useToast();

  const orderStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

  const fetchOrders = async () => {
    setLoading(true);
    // Fetch orders and related user email, and order items with product names
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:user_id ( email ),
        order_items (
          *,
          product:product_id ( name )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Error", description: "No se pudieron cargar los pedidos.", variant: "destructive" });
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status); // Initialize select with current status
    setIsModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedOrder || !newStatus) return;
    setLoading(true);
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', selectedOrder.id);

    if (error) {
      toast({ title: "Error", description: `Error al actualizar estado: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Éxito", description: "Estado del pedido actualizado." });
      setIsModalOpen(false);
      setSelectedOrder(null);
      fetchOrders(); // Refresh list
    }
    setLoading(false);
  };
  
  const SelectTriggerComponent = SelectTrigger || ((props) => <button type="button" {...props} className="w-full p-2 border rounded text-left bg-slate-700 border-slate-600" />);
  const SelectValueComponent = SelectValue || ((props) => <span {...props} />);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gestionar Pedidos</h1>

        {loading && orders.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          </div>
        ) : !loading && orders.length === 0 ? (
          <div className="text-center py-12 glass-effect rounded-lg">
            <FileText className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <p className="text-xl text-gray-400">No hay pedidos para mostrar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto glass-effect rounded-lg p-0.5">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID Pedido</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-slate-800/30 divide-y divide-slate-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-400 truncate" title={order.id}>{order.id.substring(0,8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.user?.email || order.customer_email || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">${order.total_amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'delivered' ? 'bg-green-700 text-green-100' :
                        order.status === 'shipped' ? 'bg-blue-700 text-blue-100' :
                        order.status === 'paid' ? 'bg-teal-700 text-teal-100' :
                        order.status === 'pending' ? 'bg-yellow-700 text-yellow-100' :
                        'bg-red-700 text-red-100' // cancelled
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)} className="text-purple-400 hover:text-purple-300">
                        <Eye className="h-4 w-4 mr-1" /> Ver/Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedOrder && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl">Detalles del Pedido</DialogTitle>
                <DialogDescription>ID: {selectedOrder.id}</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                <p><strong>Cliente:</strong> {selectedOrder.user?.email || selectedOrder.customer_email || 'N/A'}</p>
                <p><strong>Fecha:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                <p><strong>Total:</strong> <span className="font-bold text-green-400">${selectedOrder.total_amount}</span></p>
                
                <div>
                  <h4 className="font-semibold mb-1">Productos:</h4>
                  <ul className="list-disc list-inside pl-4 text-sm space-y-1">
                    {selectedOrder.order_items && selectedOrder.order_items.map(item => (
                      <li key={item.id}>
                        {item.quantity} x {item.product?.name || item.product_name || 'Producto Desconocido'} @ ${item.price_at_purchase} c/u
                      </li>
                    ))}
                     {(!selectedOrder.order_items || selectedOrder.order_items.length === 0) && <li>No hay productos en este pedido.</li>}
                  </ul>
                </div>

                {selectedOrder.shipping_address && (
                    <div>
                        <h4 className="font-semibold mb-1">Dirección de Envío:</h4>
                        <pre className="text-xs bg-slate-700 p-2 rounded whitespace-pre-wrap">{JSON.stringify(selectedOrder.shipping_address, null, 2)}</pre>
                    </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="status" className="font-semibold">Estado del Pedido:</Label>
                  <Select onValueChange={setNewStatus} defaultValue={selectedOrder.status} name="status">
                      <SelectTriggerComponent id="status" className="w-full bg-slate-700 border-slate-600">
                          <SelectValueComponent placeholder="Selecciona estado" />
                      </SelectTriggerComponent>
                      <SelectContent className="bg-slate-700 text-white border-slate-600">
                          {orderStatuses.map(stat => <SelectItem key={stat} value={stat} className="capitalize">{stat}</SelectItem>)}
                      </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">Cerrar</Button>
                </DialogClose>
                <Button onClick={handleStatusChange} disabled={loading || newStatus === selectedOrder.status} className="bg-purple-600 hover:bg-purple-700">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                  Actualizar Estado
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
