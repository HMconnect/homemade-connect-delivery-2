import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface CartItem {
  id: string;
  foodItemId: string;
  foodName: string;
  vendorName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  vendorId: string;
  status: string;
  totalAmount: number;
  deliveryFee: number;
  signupFee: number;
  discountAmount: number;
  discountCode?: string;
  deliveryAddress: string;
  estimatedDelivery?: string;
  paymentMethod: string;
  paymentStatus: string;
  driverLocation?: { lat: number; lng: number };
  items: CartItem[];
  createdAt: string;
}

interface CartContextType {
  cartItems: CartItem[];
  orders: Order[];
  currentOrder: Order | null;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (orderData: any) => Promise<string>;
  getOrderById: (id: string) => Order | null;
  trackOrder: (id: string) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    const existingItem = cartItems.find(ci => ci.foodItemId === item.foodItemId);
    
    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + item.quantity);
    } else {
      const newItem = { ...item, id: crypto.randomUUID() };
      setCartItems(prev => [...prev, newItem]);
      toast({ title: "Added to cart", description: `${item.foodName} added to your cart` });
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCartItems([]);

  const placeOrder = async (orderData: any): Promise<string> => {
    try {
      const { data, error } = await supabase.from('orders').insert({
        vendor_id: orderData.vendorId,
        total_amount: orderData.totalAmount,
        delivery_fee: orderData.deliveryFee,
        signup_fee: orderData.signupFee,
        discount_amount: orderData.discountAmount,
        discount_code: orderData.discountCode,
        delivery_address: orderData.deliveryAddress,
        payment_method: orderData.paymentMethod,
        estimated_delivery: new Date(Date.now() + 45 * 60000).toISOString()
      }).select().single();

      if (error) throw error;

      // Insert order items
      const orderItems = cartItems.map(item => ({
        order_id: data.id,
        food_item_id: item.foodItemId,
        food_name: item.foodName,
        quantity: item.quantity,
        price: item.price,
        special_instructions: item.specialInstructions
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;
      
      clearCart();
      toast({ title: "Order placed!", description: "Your order has been submitted successfully" });
      
      return data.id;
    } catch (error) {
      toast({ title: "Error", description: "Failed to place order", variant: "destructive" });
      throw error;
    }
  };

  const getOrderById = (id: string) => orders.find(order => order.id === id) || null;

  const trackOrder = (id: string) => {
    const order = getOrderById(id);
    if (order) setCurrentOrder(order);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      orders,
      currentOrder,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      placeOrder,
      getOrderById,
      trackOrder,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
