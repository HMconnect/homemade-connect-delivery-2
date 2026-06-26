import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Wallet, DollarSign } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/components/ui/use-toast';

interface PaymentFormProps {
  onPaymentSuccess: (orderId: string) => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onPaymentSuccess, onCancel }) => {
  const { cartItems, cartTotal, placeOrder } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showSignupFee, setShowSignupFee] = useState(true);

  const deliveryFee = 3.99;
  const signupFee = showSignupFee ? 10.00 : 0;
  const subtotal = cartTotal;
  const total = subtotal + deliveryFee + signupFee - discountAmount;

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    address: '123 Main St, Springfield, IL 62701',
    email: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const applyDiscount = () => {
    const validCodes = {
      'WELCOME10': { amount: 10, type: 'fixed' },
      'SAVE20': { amount: 20, type: 'percentage' },
      'NEWUSER': { amount: 10, type: 'signup_waiver' }
    };

    const code = validCodes[discountCode as keyof typeof validCodes];
    if (code) {
      if (code.type === 'signup_waiver') {
        setShowSignupFee(false);
        setDiscountAmount(0);
        toast({ title: "Discount applied!", description: "Signup fee waived" });
      } else if (code.type === 'fixed') {
        setDiscountAmount(code.amount);
        toast({ title: "Discount applied!", description: `$${code.amount} off your order` });
      } else if (code.type === 'percentage') {
        setDiscountAmount(subtotal * (code.amount / 100));
        toast({ title: "Discount applied!", description: `${code.amount}% off your order` });
      }
      setDiscountApplied(true);
    } else {
      toast({ title: "Invalid code", description: "Please check your discount code", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderId = await placeOrder({
        vendorId: cartItems[0]?.foodItemId || 'vendor-1',
        totalAmount: total,
        deliveryFee,
        signupFee,
        discountAmount,
        discountCode: discountApplied ? discountCode : null,
        deliveryAddress: formData.address,
        paymentMethod
      });

      onPaymentSuccess(orderId);
    } catch (error) {
      toast({ title: "Payment failed", description: "Please try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method */}
            <div>
              <Label className="text-base font-medium">Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                    <CreditCard className="h-4 w-4" />
                    <span>Credit/Debit Card</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center space-x-2 cursor-pointer">
                    <Wallet className="h-4 w-4" />
                    <span>PayPal</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center space-x-2 cursor-pointer">
                    <DollarSign className="h-4 w-4" />
                    <span>Cash on Delivery</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Card Details */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Cardholder Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Address */}
            <div>
              <Label htmlFor="address">Delivery Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Discount Code */}
            <div>
              <Label>Discount Code</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Enter discount code"
                  disabled={discountApplied}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={applyDiscount}
                  disabled={!discountCode || discountApplied}
                >
                  Apply
                </Button>
              </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              {showSignupFee && (
                <div className="flex justify-between">
                  <span>Signup Fee</span>
                  <span>${signupFee.toFixed(2)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};