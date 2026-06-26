import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, MapPin, Phone, CheckCircle, Truck, ChefHat, Package } from 'lucide-react';
import { useCart, Order } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface OrderTrackingProps {
  orderId: string;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Package, description: 'Your order has been received' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, description: 'Vendor confirmed your order' },
  { key: 'preparing', label: 'Preparing', icon: ChefHat, description: 'Your food is being prepared' },
  { key: 'ready', label: 'Ready', icon: Package, description: 'Order is ready for pickup' },
  { key: 'picked_up', label: 'Out for Delivery', icon: Truck, description: 'Driver is on the way' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, description: 'Order delivered successfully' }
];

export const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId }) => {
  const { getOrderById } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('45-60 min');
  const { toast } = useToast();

  useEffect(() => {
    const orderData = getOrderById(orderId);
    setOrder(orderData);
    
    const statusIndex = statusSteps.findIndex(step => step.key === orderData?.status);
    setCurrentStep(statusIndex >= 0 ? statusIndex : 0);

    // Subscribe to real-time order updates
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          const updatedOrder = payload.new as any;
          const newStatusIndex = statusSteps.findIndex(step => step.key === updatedOrder.status);
          setCurrentStep(newStatusIndex >= 0 ? newStatusIndex : 0);
          
          toast({
            title: 'Order Updated',
            description: `Status: ${statusSteps[newStatusIndex]?.label || updatedOrder.status}`
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);


  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (currentStep < statusSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setEstimatedTime(prev => {
          const times = ['35-45 min', '25-35 min', '15-25 min', '10-15 min', '5-10 min', 'Delivered'];
          return times[currentStep + 1] || 'Delivered';
        });
      }
    }, 30000); // Update every 30 seconds for demo

    return () => clearInterval(interval);
  }, [currentStep]);

  if (!order) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Order not found</p>
        </CardContent>
      </Card>
    );
  }

  const progress = ((currentStep + 1) / statusSteps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Order #{order.id.slice(-8)}</CardTitle>
              <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
              {statusSteps[currentStep]?.label || order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Estimated Time</p>
                <p className="text-sm text-gray-600">{estimatedTime}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Delivery Address</p>
                <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Total</p>
                <p className="text-sm text-gray-600">${order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Order Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-600 mt-2">{Math.round(progress)}% complete</p>
            </div>
            
            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <div key={step.key} className={`flex items-center space-x-4 ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`p-2 rounded-full ${isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isCurrent ? 'text-green-600' : ''}`}>
                        {step.label}
                        {isCurrent && <span className="ml-2 text-sm">(Current)</span>}
                      </p>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    {isActive && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver Info (when out for delivery) */}
      {currentStep >= 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Driver</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="font-medium">JD</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">John Driver</p>
                <p className="text-sm text-gray-600">Toyota Camry • ABC-123</p>
              </div>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};