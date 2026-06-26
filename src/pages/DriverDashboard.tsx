import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Car, MapPin, DollarSign, Star, Clock, ChefHat,
  CheckCircle, Package, Truck, Bell, TrendingUp,
  Award, Target, Zap, ChevronRight, Phone, Navigation
} from 'lucide-react';

// ─── Sample active orders ─────────────────────────────────────────────────────
const SAMPLE_AVAILABLE_ORDERS = [
  {
    id: 'ord-001',
    customerName: 'Maria G.',
    pickupVendor: "Big Mama's Kitchen",
    pickupAddress: '1234 S Michigan Ave, Chicago',
    dropoffAddress: '5678 W Madison St, Chicago',
    miles: 2.3,
    basePay: 4.50,
    tip: 3.00,
    estimatedPay: 7.50,
    items: ['Soul Food Plate x1', 'Cornbread x2'],
    prepTime: '10 min',
    category: 'soul-food',
    isPeakHour: true,
    peakBonus: 1.50,
  },
  {
    id: 'ord-002',
    customerName: 'James T.',
    pickupVendor: "Abuela Rosa's Kitchen",
    pickupAddress: '890 N Clark St, Chicago',
    dropoffAddress: '2345 N Broadway, Chicago',
    miles: 1.8,
    basePay: 4.00,
    tip: 2.00,
    estimatedPay: 6.00,
    items: ['Tamales x6'],
    prepTime: '15 min',
    category: 'latin',
    isPeakHour: false,
    peakBonus: 0,
  },
  {
    id: 'ord-003',
    customerName: 'Aisha M.',
    pickupVendor: "Mama T's Caribbean",
    pickupAddress: '456 E 63rd St, Chicago',
    dropoffAddress: '789 E 71st St, Chicago',
    miles: 1.2,
    basePay: 3.50,
    tip: 4.00,
    estimatedPay: 7.50,
    items: ['Jerk Chicken x2', 'Rice & Peas x2'],
    prepTime: '5 min',
    category: 'caribbean',
    isPeakHour: true,
    peakBonus: 1.50,
  },
];

const COMPLETED_TODAY = [
  { id: 'c1', vendor: "Sarah's Kitchen", customer: 'David L.', pay: 8.50, tip: 3.00, time: '11:32 AM', miles: 2.1 },
  { id: 'c2', vendor: "Chen's Dumplings", customer: 'Lisa W.', pay: 6.00, tip: 2.00, time: '12:15 PM', miles: 1.5 },
  { id: 'c3', vendor: "Big Mama's Kitchen", customer: 'Robert J.', pay: 9.50, tip: 5.00, time: '1:45 PM', miles: 3.2 },
];

// ─── Driver tier info ─────────────────────────────────────────────────────────
const DRIVER_TIERS = [
  { name: 'Neighborhood', color: 'bg-gray-100 text-gray-700', min: 0, bonus: 0 },
  { name: 'Community', color: 'bg-yellow-100 text-yellow-700', min: 50, bonus: 0.50 },
  { name: 'Co-op', color: 'bg-blue-100 text-blue-700', min: 150, bonus: 1.00 },
  { name: 'Elite', color: 'bg-purple-100 text-purple-700', min: 300, bonus: 1.50 },
];

const CATEGORY_EMOJI: Record<string, string> = {
  'soul-food': '🍗', 'latin': '🌮', 'caribbean': '🌴',
  'east-asian': '🥟', 'south-asian': '🍛', 'bakery': '🍞',
  'beauty-body': '🧴', 'jewelry': '💎', 'candles': '🕯️',
};

const DriverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [acceptedOrders, setAcceptedOrders] = useState<string[]>([]);
  const [orderStep, setOrderStep] = useState(0);

  // Driver stats
  const totalDeliveries = 47;
  const currentTier = DRIVER_TIERS[0];
  const nextTier = DRIVER_TIERS[1];
  const toNextTier = nextTier.min - totalDeliveries;
  const rating = 4.8;
  const todayEarnings = COMPLETED_TODAY.reduce((sum, o) => sum + o.pay + o.tip, 0);
  const weekEarnings = 312.50;
  const milestoneBonusProgress = totalDeliveries % 50;

  const ORDER_STEPS = [
    { label: 'Head to Vendor', icon: Navigation, description: 'Drive to the pickup location' },
    { label: 'Pick Up Order', icon: Package, description: 'Collect the order from the vendor' },
    { label: 'Deliver to Customer', icon: Truck, description: 'Drive to the customer' },
    { label: 'Order Complete', icon: CheckCircle, description: 'Mark as delivered' },
  ];

  const handleAcceptOrder = (order: any) => {
    setActiveOrder(order);
    setAcceptedOrders(prev => [...prev, order.id]);
    setOrderStep(0);
  };

  const handleNextStep = () => {
    if (orderStep < ORDER_STEPS.length - 1) {
      setOrderStep(s => s + 1);
    } else {
      setActiveOrder(null);
      setOrderStep(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm">HMC Driver</span>
              <span className="block text-xs text-orange-500">Homemade Connect</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              Exit
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">

        {/* Online toggle */}
        <div className={`rounded-2xl p-5 text-white ${isOnline ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-bold text-lg">{isOnline ? '🟢 You are Online' : '⚫ You are Offline'}</p>
              <p className="text-white/80 text-sm">{isOnline ? 'Ready to receive delivery orders' : 'Go online to start earning'}</p>
            </div>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`w-16 h-8 rounded-full transition-all relative ${isOnline ? 'bg-white/30' : 'bg-white/20'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow absolute top-1 transition-all ${isOnline ? 'left-9' : 'left-1'}`} />
            </button>
          </div>
          {isOnline && (
            <div className="flex gap-3 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">📍 Chicago, IL</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">🍽️ All Categories</span>
            </div>
          )}
        </div>

        {/* Active order delivery flow */}
        {activeOrder && (
          <div className="bg-white rounded-2xl border-2 border-orange-500 shadow-lg overflow-hidden">
            <div className="bg-orange-500 px-4 py-3 flex items-center justify-between">
              <span className="text-white font-bold">🚗 Active Delivery</span>
              <Badge className="bg-white text-orange-600 font-bold">
                ${(activeOrder.estimatedPay + (activeOrder.isPeakHour ? activeOrder.peakBonus : 0)).toFixed(2)}
              </Badge>
            </div>

            {/* Step progress */}
            <div className="px-4 pt-4">
              <div className="flex items-center gap-1 mb-4">
                {ORDER_STEPS.map((step, i) => (
                  <React.Fragment key={i}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i < orderStep ? 'bg-green-500 text-white'
                      : i === orderStep ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                    }`}>
                      {i < orderStep ? '✓' : i + 1}
                    </div>
                    {i < ORDER_STEPS.length - 1 && (
                      <div className={`flex-1 h-1 rounded ${i < orderStep ? 'bg-green-500' : 'bg-gray-100'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="bg-orange-50 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  {React.createElement(ORDER_STEPS[orderStep].icon, { className: 'w-5 h-5 text-orange-600' })}
                  <span className="font-bold text-orange-800">{ORDER_STEPS[orderStep].label}</span>
                </div>
                <p className="text-orange-600 text-sm">{ORDER_STEPS[orderStep].description}</p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Pickup from</p>
                    <p className="text-sm font-semibold text-gray-800">{activeOrder.pickupVendor}</p>
                    <p className="text-xs text-gray-500">{activeOrder.pickupAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Deliver to</p>
                    <p className="text-sm font-semibold text-gray-800">{activeOrder.customerName}</p>
                    <p className="text-xs text-gray-500">{activeOrder.dropoffAddress}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pb-4">
                <Button variant="outline" size="sm" className="flex-1 border-gray-200">
                  <Phone className="w-4 h-4 mr-1" /> Call Customer
                </Button>
                <Button
                  onClick={handleNextStep}
                  size="sm"
                  className={`flex-1 ${orderStep === ORDER_STEPS.length - 1 ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
                >
                  {orderStep === ORDER_STEPS.length - 1 ? '✅ Complete' : 'Next Step →'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Today's earnings summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 border border-gray-100 text-center">
            <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-gray-900">${todayEarnings.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Today</p>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-gray-100 text-center">
            <TrendingUp className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-gray-900">${weekEarnings}</p>
            <p className="text-xs text-gray-500">This Week</p>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-gray-100 text-center">
            <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-gray-900">{rating}⭐</p>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="grid grid-cols-3 bg-orange-50 w-full">
            <TabsTrigger value="orders" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs">
              📦 Orders
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs">
              💰 Earnings
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs">
              🏆 Rewards
            </TabsTrigger>
          </TabsList>

          {/* ── ORDERS TAB ─────────────────────────────────── */}
          <TabsContent value="orders" className="mt-4 space-y-3">
            {!isOnline ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Go online to see available orders</p>
                <Button onClick={() => setIsOnline(true)} className="mt-4 bg-green-500 hover:bg-green-600 text-white">
                  Go Online
                </Button>
              </div>
            ) : (
              <>
                {/* Peak hour banner */}
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-white flex-shrink-0" />
                  <div>
                    <p className="text-white font-bold text-sm">🔥 Peak Hour Bonus Active!</p>
                    <p className="text-white/90 text-xs">+$1.50 on every delivery until 2:00 PM</p>
                  </div>
                </div>

                <p className="text-sm font-semibold text-gray-700">{SAMPLE_AVAILABLE_ORDERS.length} orders available near you</p>

                {SAMPLE_AVAILABLE_ORDERS.map(order => (
                  <div key={order.id} className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                    acceptedOrders.includes(order.id) ? 'border-green-300 opacity-60' : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                  }`}>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{CATEGORY_EMOJI[order.category] || '🍽️'}</span>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{order.pickupVendor}</p>
                            <p className="text-xs text-gray-500">{order.items.join(', ')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">
                            ${(order.estimatedPay + (order.isPeakHour ? order.peakBonus : 0)).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">{order.miles} miles</p>
                        </div>
                      </div>

                      <div className="flex gap-2 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Ready in {order.prepTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {order.miles} mi
                        </span>
                        {order.isPeakHour && (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                            +$1.50 peak
                          </span>
                        )}
                      </div>

                      {/* Pay breakdown */}
                      <div className="bg-gray-50 rounded-lg p-2 mb-3 text-xs text-gray-600 grid grid-cols-3 gap-1 text-center">
                        <div><span className="font-medium">${order.basePay.toFixed(2)}</span><br/>Base</div>
                        <div><span className="font-medium">${order.tip.toFixed(2)}</span><br/>Tip</div>
                        <div><span className="font-medium text-yellow-600">${(order.isPeakHour ? order.peakBonus : 0).toFixed(2)}</span><br/>Bonus</div>
                      </div>

                      {acceptedOrders.includes(order.id) ? (
                        <div className="text-center text-green-600 font-semibold text-sm py-1">
                          ✅ Order Accepted
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleAcceptOrder(order)}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                          disabled={!!activeOrder}
                        >
                          {activeOrder ? 'Complete current order first' : 'Accept Order'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </TabsContent>

          {/* ── EARNINGS TAB ───────────────────────────────── */}
          <TabsContent value="earnings" className="mt-4 space-y-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
              <p className="text-white/80 text-sm mb-1">Total Earned Today</p>
              <p className="text-4xl font-bold mb-3">${todayEarnings.toFixed(2)}</p>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="bg-white/20 rounded-xl p-2">
                  <p className="font-bold">${COMPLETED_TODAY.reduce((s,o) => s + o.pay, 0).toFixed(2)}</p>
                  <p className="text-white/80 text-xs">Base Pay</p>
                </div>
                <div className="bg-white/20 rounded-xl p-2">
                  <p className="font-bold">${COMPLETED_TODAY.reduce((s,o) => s + o.tip, 0).toFixed(2)}</p>
                  <p className="text-white/80 text-xs">Tips (100%)</p>
                </div>
                <div className="bg-white/20 rounded-xl p-2">
                  <p className="font-bold">$3.00</p>
                  <p className="text-white/80 text-xs">Peak Bonus</p>
                </div>
              </div>
            </div>

            {/* Milestone bonus progress */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  <span className="font-bold text-gray-800">Milestone Bonus</span>
                </div>
                <span className="text-orange-600 font-bold text-sm">$50 at 50 deliveries</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all"
                  style={{width: `${(milestoneBonusProgress / 50) * 100}%`}}
                />
              </div>
              <p className="text-xs text-gray-500">{milestoneBonusProgress} of 50 deliveries — {50 - milestoneBonusProgress} more to earn $50 bonus</p>
            </div>

            {/* Completed today */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-50">
                <h3 className="font-bold text-gray-800">Completed Today ({COMPLETED_TODAY.length})</h3>
              </div>
              {COMPLETED_TODAY.map((delivery, i) => (
                <div key={delivery.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{delivery.vendor}</p>
                      <p className="text-xs text-gray-400">{delivery.time} · {delivery.miles} mi</p>
                    </div>
                  </div>
                  <span className="font-bold text-green-600">${(delivery.pay + delivery.tip).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Payout info */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="font-bold text-blue-800 text-sm mb-1">💳 Payout Schedule</p>
              <p className="text-blue-700 text-xs">Weekly deposit every Friday to your bank account. Instant cashout available anytime for $0.50 fee.</p>
            </div>
          </TabsContent>

          {/* ── REWARDS TAB ────────────────────────────────── */}
          <TabsContent value="rewards" className="mt-4 space-y-4">

            {/* Current tier */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-8 h-8" />
                <div>
                  <p className="text-white/80 text-sm">Current Level</p>
                  <p className="text-2xl font-bold">{currentTier.name} Driver</p>
                </div>
              </div>
              <p className="text-white/90 text-sm mb-3">
                {totalDeliveries} total deliveries · {rating}⭐ rating
              </p>
              <div className="bg-white/20 rounded-xl p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress to {nextTier.name}</span>
                  <span>{toNextTier} deliveries away</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full"
                    style={{width: `${(totalDeliveries / nextTier.min) * 100}%`}}
                  />
                </div>
              </div>
            </div>

            {/* All tiers */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-50">
                <h3 className="font-bold text-gray-800">Driver Reward Tiers</h3>
                <p className="text-xs text-gray-500">Unlock better pay as you grow</p>
              </div>
              {DRIVER_TIERS.map((tier, i) => (
                <div key={tier.name} className={`flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0 ${
                  i === 0 ? 'bg-orange-50' : ''
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {i === 0 ? '✓' : tier.min}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{tier.name} Driver</p>
                      <p className="text-xs text-gray-500">{tier.min}+ deliveries required</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {tier.bonus > 0 ? (
                      <span className="text-green-600 font-bold text-sm">+${tier.bonus.toFixed(2)}/delivery</span>
                    ) : (
                      <span className="text-gray-400 text-sm">Base pay</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Co-ownership pathway */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ChefHat className="w-5 h-5 text-purple-600" />
                <p className="font-bold text-purple-800">Co-ownership Pathway</p>
              </div>
              <p className="text-purple-700 text-sm mb-3">
                Reach Elite Driver status (300 deliveries + 4.9⭐) and earn an ownership stake in Homemade Connect Delivery. You become more than a driver — you become a co-owner.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-600">Your progress: {totalDeliveries}/300</span>
                <span className="font-bold text-purple-800">{Math.round((totalDeliveries/300)*100)}%</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2 mt-1">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: `${(totalDeliveries/300)*100}%`}} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DriverDashboard;
