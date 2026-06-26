import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SendCustomSMS } from './SendCustomSMS';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Clock, DollarSign, Package, MessageSquare } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  picked_up: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
};

export const VendorOrdersTab: React.FC = () => {
  const { profile } = useAuth();
  const { orders, loading } = useRealtimeOrders(profile?.id, 'vendor');
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update order', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Order updated to ${newStatus}` });
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Orders</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredOrders.length === 0 ? (
        <Card><CardContent className="p-6 text-center text-gray-500">No orders found</CardContent></Card>
      ) : (
        filteredOrders.map(order => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                  <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <Badge className={statusColors[order.status]}>{order.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="font-semibold">${order.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span>{order.items?.length || 0} items</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{order.delivery_address}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <Button size="sm" onClick={() => updateOrderStatus(order.id, 'confirmed')}>Confirm</Button>
                )}
                {order.status === 'confirmed' && (
                  <Button size="sm" onClick={() => updateOrderStatus(order.id, 'preparing')}>Start Preparing</Button>
                )}
                {order.status === 'preparing' && (
                  <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ready')}>Mark Ready</Button>
                )}
                {order.status === 'ready' && (
                  <Button size="sm" onClick={() => updateOrderStatus(order.id, 'picked_up')}>Mark Picked Up</Button>
                )}
                <Button size="sm" variant="outline" onClick={() => { setSelectedOrder(order); setSmsModalOpen(true); }}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Send SMS
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={smsModalOpen} onOpenChange={setSmsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send SMS to Customer</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <SendCustomSMS 
              orderId={selectedOrder.id}
              customerPhone={selectedOrder.customer_phone}
              customerName={selectedOrder.customer_name}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

