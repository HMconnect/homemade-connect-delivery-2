import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, ShoppingCart, User, Clock, Filter, ShoppingBag, Shield, ChefHat, Star, Truck, Heart, Globe } from 'lucide-react';
import { FoodCard } from './FoodCard';
import { VendorCard } from './VendorCard';
import { CartSheet } from './Cart';
import { OrderTracking } from './OrderTracking';
import { PaymentForm } from './PaymentForm';
import { CustomerOrdersView } from './CustomerOrdersView';
import { NotificationSystem } from './NotificationSystem';
import { LocationSelector } from './LocationSelector';
import { CommunityShowcase } from './CommunityShowcase';
import { MarketShowcase } from './MarketShowcase';
import { MarketItemCard } from './MarketItemCard';
import { CartProvider, useCart } from '@/contexts/CartContext';
import { CUSTOMER_TIERS } from '@/lib/constants';
import { COMMUNITIES, MARKET_CATEGORIES, SAMPLE_MARKET_PRODUCTS } from '@/lib/communities';

const VENDORS_FALLBACK = [
  {
    id: '1',
    name: "Big Mama's Kitchen",
    image: 'https://d64gsuwffb70l.cloudfront.net/68da9d653efb6b8fad30f591_1759157961039_47ed3af4.webp',
    rating: 4.9,
    deliveryTime: '25-40 min',
    distance: '0.8 mi',
    specialty: 'Soul Food & Southern Comfort',
    isPartner: true,
    tier: 'kitchen',
    community: 'soul-food',
    badge: '🍗 Soul Food',
  },
  {
    id: '2',
    name: "Abuela Rosa's Kitchen",
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    rating: 4.9,
    deliveryTime: '20-35 min',
    distance: '1.5 mi',
    specialty: 'Traditional Mexican — Tamales & Mole',
    isPartner: true,
    tier: 'coop',
    community: 'latin',
    badge: '🌮 Latino',
  },
  {
    id: '3',
    name: "Mama T's Caribbean",
    image: 'https://d64gsuwffb70l.cloudfront.net/68da9d653efb6b8fad30f591_1759157963467_ead004fc.webp',
    rating: 5.0,
    deliveryTime: '30-45 min',
    distance: '1.2 mi',
    specialty: 'Jerk Chicken, Oxtail & Caribbean Classics',
    isPartner: true,
    tier: 'kitchen',
    community: 'caribbean',
    badge: '🌴 Caribbean',
  },
  {
    id: '4',
    name: "Chen's Dumpling House",
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
    rating: 4.8,
    deliveryTime: '20-30 min',
    distance: '0.9 mi',
    specialty: 'Handmade Dumplings & Chinese Home Cooking',
    isPartner: false,
    tier: 'basic',
    community: 'east-asian',
    badge: '家常菜 East Asian',
  },
  {
    id: '5',
    name: "Priya's Desi Kitchen",
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    rating: 4.9,
    deliveryTime: '25-40 min',
    distance: '1.1 mi',
    specialty: 'Authentic Biryani, Curry & Indian Street Food',
    isPartner: false,
    tier: 'coop',
    community: 'south-asian',
    badge: '🍛 Desi',
  },
  {
    id: '6',
    name: "Miriam's Kosher Kitchen",
    image: 'https://images.unsplash.com/photo-1533007716222-4b465613a984?w=400',
    rating: 4.7,
    deliveryTime: '25-35 min',
    distance: '2.0 mi',
    specialty: 'Kosher-Certified Brisket, Challah & Jewish Classics',
    isPartner: false,
    tier: 'basic',
    community: 'jewish-kosher',
    badge: '✡️ Kosher',
  },
];

const SAMPLE_PRODUCTS_EXTENDED = [
  {
    id: 'sourdough',
    name: 'Artisan Sourdough Bread',
    vendor_name: "Sarah's Kitchen",
    price: 8.50, rating: 4.9,
    prep_time_min: 25, prep_time_max: 35,
    image_url: 'https://d64gsuwffb70l.cloudfront.net/68da9d653efb6b8fad30f591_1759157952729_583c4d9c.webp',
    category: 'bakery',
    description: 'Handcrafted sourdough with a perfect crust',
  },
  {
    id: 'soul-plate',
    name: 'Sunday Soul Food Plate',
    vendor_name: "Big Mama's Kitchen",
    price: 20.00, rating: 4.9,
    prep_time_min: 35, prep_time_max: 50,
    image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    category: 'soul-food',
    description: 'Fried chicken, mac & cheese, collard greens & cornbread',
  },
  {
    id: 'tamales',
    name: 'Homemade Tamales (6 pack)',
    vendor_name: "Abuela Rosa's Kitchen",
    price: 16.00, rating: 4.9,
    prep_time_min: 20, prep_time_max: 35,
    image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    category: 'latin',
    description: 'Traditional pork tamales wrapped in corn husks, made fresh daily',
  },
  {
    id: 'jerk-chicken',
    name: 'Jerk Chicken Plate',
    vendor_name: "Mama T's Caribbean",
    price: 18.00, rating: 5.0,
    prep_time_min: 30, prep_time_max: 45,
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    category: 'caribbean',
    description: 'Authentic jerk chicken with rice & peas and plantains',
  },
  {
    id: 'dumplings',
    name: 'Handmade Pork Dumplings (12 pcs)',
    vendor_name: "Chen's Dumpling House",
    price: 14.00, rating: 4.8,
    prep_time_min: 20, prep_time_max: 30,
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
    category: 'east-asian',
    description: 'Traditional hand-folded dumplings with ginger pork filling',
  },
  {
    id: 'biryani',
    name: 'Chicken Biryani',
    vendor_name: "Priya's Desi Kitchen",
    price: 17.00, rating: 4.9,
    prep_time_min: 30, prep_time_max: 45,
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
    category: 'south-asian',
    description: 'Aromatic basmati rice with tender chicken and whole spices',
  },
  {
    id: 'challah',
    name: 'Fresh Baked Challah',
    vendor_name: "Miriam's Kosher Kitchen",
    price: 12.00, rating: 4.7,
    prep_time_min: 25, prep_time_max: 40,
    image_url: 'https://images.unsplash.com/photo-1534620808146-d33bb39128b2?w=400',
    category: 'jewish-kosher',
    description: 'Traditional braided challah, baked fresh every Friday',
  },
  {
    id: 'falafel',
    name: 'Falafel Plate with Hummus',
    vendor_name: "Fatima's Middle Eastern Kitchen",
    price: 15.00, rating: 4.8,
    prep_time_min: 20, prep_time_max: 30,
    image_url: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=400',
    category: 'middle-eastern',
    description: 'Crispy homemade falafel with house hummus and fresh pita',
  },
  {
    id: 'jollof',
    name: 'Party Jollof Rice',
    vendor_name: "Auntie Ade's Kitchen",
    price: 19.00, rating: 5.0,
    prep_time_min: 35, prep_time_max: 50,
    image_url: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400',
    category: 'west-african',
    description: 'Nigerian party jollof rice with chicken and fried plantains',
  },
  {
    id: 'pad-thai',
    name: 'Homemade Pad Thai',
    vendor_name: "Nong's Thai Kitchen",
    price: 16.00, rating: 4.8,
    prep_time_min: 20, prep_time_max: 35,
    image_url: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
    category: 'southeast-asian',
    description: 'Authentic pad thai with shrimp, bean sprouts and crushed peanuts',
  },
  {
    id: 'pierogi',
    name: 'Handmade Pierogis (dozen)',
    vendor_name: "Babcia's Polish Kitchen",
    price: 18.00, rating: 4.7,
    prep_time_min: 25, prep_time_max: 40,
    image_url: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400',
    category: 'eastern-european',
    description: 'Potato & cheese pierogis, boiled then pan-fried in butter',
  },
  {
    id: 'vegan-bowl',
    name: 'Rainbow Grain Bowl',
    vendor_name: "Green Soul Kitchen",
    price: 14.00, rating: 4.6,
    prep_time_min: 15, prep_time_max: 25,
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    category: 'vegan',
    description: 'Quinoa, roasted veggies, avocado & tahini dressing',
  },
];

const AppLayoutContent: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { selectedState, selectedCity, stateLabel } = useLocation();
  const [showPayment, setShowPayment] = useState(false);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('delivery');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart } = useCart();

  const { products: supabaseProducts, loading } = useProducts(selectedState, selectedCity, searchQuery, selectedCategory);

  // Use Supabase products if available, otherwise use extended sample set
  const displayProducts = supabaseProducts.length > 3
    ? supabaseProducts
    : SAMPLE_PRODUCTS_EXTENDED.filter(p => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });

  const handlePaymentSuccess = (orderId: string) => {
    setCurrentOrderId(orderId);
    setShowPayment(false);
    setShowOrderTracking(true);
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      foodItemId: item.id,
      foodName: item.name,
      vendorName: item.vendor_name || item.vendor,
      price: item.price,
      quantity: 1,
      imageUrl: item.image_url || item.image,
    });
  };

  const filteredVendors = selectedCategory === 'all'
    ? VENDORS_FALLBACK
    : VENDORS_FALLBACK.filter(v => v.community === selectedCategory);

  // Get community info for selected category
  const activeCommunity = COMMUNITIES.find(c => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-sm">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg text-gray-900 leading-tight">Homemade Connect</span>
                <span className="block text-xs text-orange-500 font-medium leading-tight">Delivery</span>
              </div>
              <span className="sm:hidden font-bold text-base text-gray-900">HMC</span>
            </div>

            <LocationSelector />

            <div className="flex items-center gap-1">
              <NotificationSystem />
              {(profile?.role === 'admin' || profile?.is_admin) && (
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                  <Shield className="h-5 w-5 text-blue-600" />
                </Button>
              )}
              {profile?.role === 'vendor' && profile?.application_status === 'approved' && (
                <Button variant="ghost" size="sm" onClick={() => navigate('/vendor-dashboard')}>
                  <ShoppingBag className="h-5 w-5 text-green-600" />
                </Button>
              )}
              <CartSheet>
                <Button variant="ghost" size="sm">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </CartSheet>
              <Button variant="ghost" size="sm" onClick={() => setShowOrderHistory(true)}>
                <Clock className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero — dynamically changes when a community is selected */}
      <section className={`relative bg-gradient-to-br overflow-hidden ${
        activeCommunity ? activeCommunity.color : 'from-orange-500 via-red-500 to-pink-600'
      }`}>
        <div className="absolute inset-0 opacity-5"
          style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-2xl">
            {activeCommunity ? (
              // Community-specific hero
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-5xl">{activeCommunity.emoji}</span>
                  <div>
                    <div className="text-white/80 text-sm font-medium">{activeCommunity.description}</div>
                    {/* Native script display */}
                    <div className="text-white font-bold text-2xl" style={{
                      fontFamily: 'serif',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}>
                      {activeCommunity.script}
                    </div>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {activeCommunity.name} Home Cooks
                </h1>
                <p className="text-white/90 text-sm mb-4">
                  Authentic {activeCommunity.name} cooking made by community members in {selectedCity}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {activeCommunity.sampleDishes.map(dish => (
                    <span key={dish} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full border border-white/30">
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              // Default hero
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-white/20 text-white border-white/30 text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    {COMMUNITIES.length} Cultural Communities in {selectedCity}
                  </Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
                  Every Culture.<br />Every Flavor.<br />One Community.
                </h1>
                <p className="text-white/90 text-sm mb-4">
                  Authentic homemade food from Black, Latino, Asian, Jewish, Desi, Caribbean, African & more home cooks in {stateLabel}.
                </p>

                {/* Cultural script sampler */}
                <div className="flex flex-wrap gap-3 mb-5">
                  {['家常菜', 'घर का खाना', 'בית מטבח', 'مطبخ البيت', 'Sabor Latino', 'Irie Kitchen'].map((script, i) => (
                    <span key={i} className="bg-white/15 text-white/90 text-sm px-3 py-1 rounded-full border border-white/20" style={{fontFamily: 'serif'}}>
                      {script}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-4 text-white/90">
                    <span className="text-center"><div className="text-xl font-bold">12+</div><div className="text-xs">Communities</div></span>
                    <span className="w-px h-8 bg-white/30" />
                    <span className="text-center"><div className="text-xl font-bold">4</div><div className="text-xs">States</div></span>
                    <span className="w-px h-8 bg-white/30" />
                    <span className="text-center"><div className="text-xl font-bold">$0</div><div className="text-xs">Delivery w/ Membership</div></span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-5">
              <Button
                onClick={() => setShowSubscription(true)}
                className="bg-white text-orange-600 hover:bg-orange-50 font-semibold shadow-lg"
              >
                <Heart className="w-4 h-4 mr-2" />
                Join the Co-op
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/vendor-application')}
              >
                <ChefHat className="w-4 h-4 mr-2" />
                Become a Vendor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-orange-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-6 text-xs text-orange-700 flex-wrap">
          <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-orange-400 text-orange-400" /> Verified Home Cooks</span>
          <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Fast Local Delivery</span>
          <span className="flex items-center gap-1">✡️ Kosher Available</span>
          <span className="flex items-center gap-1">🌙 Halal Available</span>
          <span className="flex items-center gap-1">🌱 Vegan Available</span>
          <span className="flex items-center gap-1">🏘️ IL • GA • WI • MI</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder={`Search tamales, biryani, jollof rice in ${selectedCity}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-orange-400"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-sm bg-orange-50 mb-6">
            <TabsTrigger value="delivery" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              🍽️ Food
            </TabsTrigger>
            <TabsTrigger value="vendors" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              👩‍🍳 Vendors
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              🛍️ Market
            </TabsTrigger>
          </TabsList>

          <TabsContent value="delivery">
            {/* Cultural Community Showcase */}
            <CommunityShowcase
              onSelectCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
            />

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {loading ? 'Loading...' : `${displayProducts.length} dishes ${activeCommunity ? `from ${activeCommunity.name} cooks` : 'near you'} in ${selectedCity}`}
              </h2>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs text-orange-600 hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-white rounded-xl h-64 animate-pulse border" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayProducts.map((item: any) => (
                  <FoodCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    vendor={item.vendor_name}
                    price={item.price}
                    rating={item.rating || 4.5}
                    deliveryTime={`${item.prep_time_min}-${item.prep_time_max} min`}
                    prepTime={`${item.prep_time_min}-${item.prep_time_max} min`}
                    distance="Nearby"
                    image={item.image_url}
                    category={item.category}
                    description={item.description}
                    onClick={() => handleAddToCart(item)}
                  />
                ))}
                {displayProducts.length === 0 && (
                  <div className="col-span-4 text-center py-16">
                    <span className="text-5xl mb-3 block">{activeCommunity?.emoji || '🍽️'}</span>
                    <p className="text-gray-500 font-medium">
                      No {activeCommunity?.name || ''} vendors yet in {selectedCity}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">Know a great home cook? Invite them!</p>
                    <Button className="mt-4 bg-orange-500 hover:bg-orange-600" onClick={() => navigate('/vendor-application')}>
                      Apply as a Vendor
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="vendors">
            <div className="mb-4">
              <CommunityShowcase onSelectCategory={setSelectedCategory} selectedCategory={selectedCategory} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {filteredVendors.length} vendors in {selectedCity}
              {activeCommunity ? ` — ${activeCommunity.name}` : ''}
            </h2>
            <div className="space-y-4">
              {filteredVendors.map((vendor) => (
                <div key={vendor.id} className="relative">
                  <div className="absolute -top-2 left-4 z-10 flex gap-1">
                    {vendor.tier === 'kitchen' && (
                      <Badge className="bg-orange-500 text-white text-xs">🚐 Kitchen Partner</Badge>
                    )}
                    {vendor.tier === 'coop' && (
                      <Badge className="bg-green-500 text-white text-xs">🤝 Co-op Member</Badge>
                    )}
                    <Badge className="bg-white border text-gray-700 text-xs" style={{fontFamily: 'serif'}}>
                      {vendor.badge}
                    </Badge>
                  </div>
                  <VendorCard
                    vendor={{
                      id: vendor.id,
                      name: vendor.name,
                      image: vendor.image,
                      cuisine: vendor.specialty,
                      rating: vendor.rating,
                      prepTime: vendor.deliveryTime,
                      distance: vendor.distance,
                      description: vendor.specialty,
                    }}
                    onClick={() => console.log('Vendor clicked:', vendor.name)}
                  />
                </div>
              ))}
              {filteredVendors.length === 0 && (
                <div className="text-center py-12">
                  <span className="text-5xl mb-3 block">{activeCommunity?.emoji}</span>
                  <p className="text-gray-500">No {activeCommunity?.name} vendors in {selectedCity} yet.</p>
                  <Button className="mt-4 bg-orange-500 hover:bg-orange-600" onClick={() => navigate('/vendor-application')}>
                    Be the First {activeCommunity?.name} Vendor
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── MARKET TAB ─────────────────────────────────── */}
          <TabsContent value="market">
            {/* Market hero banner */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-5 mb-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px'}} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🛍️</span>
                  <h2 className="text-xl font-bold">Community Market</h2>
                </div>
                <p className="text-white/90 text-sm mb-3">
                  Handmade goods from {selectedCity} community makers — soap, jewelry, art, candles & more. All delivered same-day by our drivers.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['🧴 Beauty', '💎 Jewelry', '🕯️ Candles', '🎨 Art', '🧶 Textiles', '🌿 Plants'].map(tag => (
                    <span key={tag} className="bg-white/20 text-white text-xs px-2 py-1 rounded-full border border-white/30">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Market category showcase */}
            <MarketShowcase
              onSelectCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
            />

            {/* Market products grid */}
            {(() => {
              const activeMarketCat = MARKET_CATEGORIES.find(c => c.id === selectedCategory);
              const marketProducts = selectedCategory === 'market-all' || !MARKET_CATEGORIES.find(c => c.id === selectedCategory)
                ? SAMPLE_MARKET_PRODUCTS
                : SAMPLE_MARKET_PRODUCTS.filter(p => p.category === selectedCategory);

              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {activeMarketCat
                        ? `${activeMarketCat.emoji} ${activeMarketCat.name} in ${selectedCity}`
                        : `All handmade goods in ${selectedCity}`}
                    </h3>
                    {selectedCategory !== 'market-all' && MARKET_CATEGORIES.find(c => c.id === selectedCategory) && (
                      <button onClick={() => setSelectedCategory('market-all')}
                        className="text-xs text-orange-600 hover:underline">
                        Show all
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {marketProducts.map((item: any) => (
                      <MarketItemCard
                        key={item.id}
                        {...item}
                        onClick={() => handleAddToCart(item)}
                      />
                    ))}
                    {marketProducts.length === 0 && (
                      <div className="col-span-4 text-center py-16">
                        <span className="text-5xl mb-3 block">{activeMarketCat?.emoji || '🛍️'}</span>
                        <p className="text-gray-500 font-medium">No {activeMarketCat?.name} makers in {selectedCity} yet</p>
                        <p className="text-gray-400 text-sm mt-1">Know a maker? Invite them to join!</p>
                        <Button className="mt-4 bg-orange-500 hover:bg-orange-600" onClick={() => navigate('/vendor-application')}>
                          Apply as a Vendor
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Become a maker CTA */}
                  <div className="mt-8 bg-purple-50 border border-purple-200 rounded-2xl p-5 text-center">
                    <p className="text-lg font-bold text-purple-800 mb-1">Are you a maker?</p>
                    <p className="text-sm text-purple-600 mb-4">
                      Sell your handmade soaps, jewelry, art & crafts on Homemade Connect.<br />
                      Our drivers deliver your goods same-day across {selectedCity}.
                    </p>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => navigate('/vendor-application')}
                    >
                      Apply to Sell in the Market
                    </Button>
                  </div>
                </>
              );
            })()}
          </TabsContent>

        </Tabs>
      </div>

      {/* Subscription Modal */}
      <Dialog open={showSubscription} onOpenChange={setShowSubscription}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              Join the Homemade Connect Co-op
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {Object.values(CUSTOMER_TIERS).map((tier) => (
              <div key={tier.id} className={`rounded-xl border-2 p-5 cursor-pointer hover:shadow-md transition-all ${
                tier.id === 'coop' ? 'border-orange-500 bg-orange-50'
                : tier.id === 'member' ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200 bg-white'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{tier.name}</h3>
                    {tier.id === 'coop' && <Badge className="bg-orange-500 text-white text-xs mt-1">Most Popular</Badge>}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{tier.price === 0 ? 'Free' : `$${tier.price}`}</div>
                    {tier.price > 0 && <div className="text-xs text-gray-500">/month</div>}
                  </div>
                </div>
                <ul className="space-y-1.5 mb-4">
                  {tier.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500">✓</span>{perk}
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${
                  tier.id === 'coop' ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : tier.id === 'member' ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`} onClick={() => setShowSubscription(false)}>
                  {tier.price === 0 ? 'Continue for Free' : `Join for $${tier.price}/mo`}
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogs */}
      <Dialog open={showOrderTracking} onOpenChange={setShowOrderTracking}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Track Your Order</DialogTitle></DialogHeader>
          <OrderTracking orderId={currentOrderId} />
        </DialogContent>
      </Dialog>
      <Dialog open={showOrderHistory} onOpenChange={setShowOrderHistory}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>My Orders</DialogTitle></DialogHeader>
          <CustomerOrdersView />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AppLayout: React.FC = () => (
  <CartProvider>
    <AppLayoutContent />
  </CartProvider>
);

export default AppLayout;

