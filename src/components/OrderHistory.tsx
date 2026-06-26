import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Package, Star, RotateCcw } from 'lucide-react';
import { useCart, Order } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';

export const OrderHistory: React.FC = () => {
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match Order interface
      const transformedOrders = ordersData?.map(order => ({
        id: order.id,
        vendorId: order.vendor_id,
        status: order.status,
        totalAmount: order.total_amount,
        deliveryFee: order.delivery_fee,
        signupFee: order.signup_fee || 0,
        discountAmount: order.discount_amount || 0,
        discountCode: order.discount_code,
        deliveryAddress: order.delivery_address,
        estimatedDelivery: order.estimated_delivery,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        driverLocation: order.driver_location,
        items: order.order_items?.map((item: any) => ({
          id: item.id,
          foodItemId: item.food_item_id,
          foodName: item.food_name,
          vendorName: 'HomeMade Vendor', // Would come from vendor table
          price: item.price,
          quantity: item.quantity,
          imageUrl: '/api/placeholder/80/80',
          specialInstructions: item.special_instructions
        })) || [],
        createdAt: order.created_at
      })) || [];

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setLoading(false);
    }
  };

  const reorderItems = (order: Order) => {
    order.items.forEach(item => {
      addToCart({
        foodItemId: item.foodItemId,
        foodName: item.foodName,
        vendorName: item.vendorName,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        specialInstructions: item.specialInstructions
      });
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      case 'preparing': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500">Your order history will appear here once you place your first order.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Order History</h2>
        <Badge variant="outline">{orders.length} orders</Badge>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span>•</span>
                    <span>{order.items.length} items</span>
                    <span>•</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  {order.status === 'delivered' && (
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4 mr-1" />
                      Rate
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img 
                      src={item.imageUrl} 
                      alt={item.foodName}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.foodName}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>Delivered to: {order.deliveryAddress}</p>
                  <p>Payment: {order.paymentMethod}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => reorderItems(order)}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reorder
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};