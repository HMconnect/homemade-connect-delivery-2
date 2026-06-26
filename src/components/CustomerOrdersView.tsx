import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { OrderTracking } from './OrderTracking';
import { Clock, DollarSign, Package, Eye } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  picked_up: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
};

export const CustomerOrdersView: React.FC = () => {
  const { profile } = useAuth();
  const { orders, loading } = useRealtimeOrders(profile?.id, 'customer');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  if (loading) return <div>Loading orders...</div>;

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">My Orders</h2>
        
        {orders.length === 0 ? (
          <Card><CardContent className="p-6 text-center text-gray-500">No orders yet</CardContent></Card>
        ) : (
          orders.map(order => (
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
                <Button size="sm" onClick={() => setSelectedOrder(order.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Track Order
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Tracking</DialogTitle>
          </DialogHeader>
          {selectedOrder && <OrderTracking orderId={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </>
  );
};
