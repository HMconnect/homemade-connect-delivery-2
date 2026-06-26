import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, Printer } from 'lucide-react';

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

interface ReceiptProps {
  orderId: string;
  orderDate: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  customerName?: string;
  deliveryAddress?: string;
}

export const ReceiptGenerator: React.FC<ReceiptProps> = ({
  orderId, orderDate, items, subtotal, tax, deliveryFee, total, customerName, deliveryAddress
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const receiptContent = `
      ORDER RECEIPT
      Order #${orderId}
      Date: ${new Date(orderDate).toLocaleString()}
      ${customerName ? `Customer: ${customerName}` : ''}
      ${deliveryAddress ? `Delivery: ${deliveryAddress}` : ''}
      
      ITEMS:
      ${items.map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}
      
      Subtotal: $${subtotal.toFixed(2)}
      Tax: $${tax.toFixed(2)}
      Delivery: $${deliveryFee.toFixed(2)}
      TOTAL: $${total.toFixed(2)}
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${orderId}.txt`;
    a.click();
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Receipt</CardTitle>
        <p className="text-center text-sm text-gray-600">Order #{orderId.slice(-8)}</p>
        <p className="text-center text-xs text-gray-500">{new Date(orderDate).toLocaleString()}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {customerName && <p className="text-sm"><strong>Customer:</strong> {customerName}</p>}
        {deliveryAddress && <p className="text-sm"><strong>Delivery:</strong> {deliveryAddress}</p>}
        
        <Separator />
        
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <Separator />
        
        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax:</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Delivery:</span><span>${deliveryFee.toFixed(2)}</span></div>
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload} variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
