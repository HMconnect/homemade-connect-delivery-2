import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-500">Add some delicious cottage food items to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cartItems.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <img 
                src={item.imageUrl} 
                alt={item.foodName}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{item.foodName}</h4>
                <p className="text-sm text-gray-500">{item.vendorName}</p>
                <p className="text-lg font-semibold text-green-600">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {item.specialInstructions && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                <strong>Special instructions:</strong> {item.specialInstructions}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-green-600">${cartTotal.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{cartCount} items in cart</p>
        </CardContent>
      </Card>
    </div>
  );
};

export const CartSheet: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cartCount } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">
          {children}
          {cartCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500">
              {cartCount}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <Cart />
        </div>
      </SheetContent>
    </Sheet>
  );
};