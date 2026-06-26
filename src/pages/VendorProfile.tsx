import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import {
  ArrowLeft, Star, MapPin, Clock, Heart, Share2,
  ChefHat, Award, ShoppingBag, MessageCircle, CheckCircle
} from 'lucide-react';

// Sample vendor data — will come from Supabase once connected
const SAMPLE_VENDOR = {
  id: '1',
  name: "Big Mama's Kitchen",
  ownerName: 'Dorothy Williams',
  avatar: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=200',
  coverImage: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
  specialty: 'Soul Food & Southern Comfort',
  community: '🍗 Soul Food',
  city: 'Chicago',
  state: 'IL',
  rating: 4.9,
  reviewCount: 124,
  totalOrders: 847,
  memberSince: 'March 2024',
  tier: 'kitchen',
  isVerified: true,
  story: "I've been cooking my grandmother's recipes for over 30 years. Growing up on the South Side of Chicago, Sunday dinner was everything — it was how we showed love, celebrated life, and kept our family together. Now I'm bringing that same love to your door. Every plate I make is made with the same care I'd give my own family.",
  deliveryTime: '25-40 min',
  minOrder: 15.00,
  badges: ['✡️ Kosher Options', '🌱 Vegan Options', '🧂 Low Sodium Available'],
  products: [
    {
      id: 'p1', name: 'Sunday Soul Food Plate', price: 20.00, rating: 4.9,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
      description: 'Fried chicken, mac & cheese, collard greens & cornbread',
      category: 'soul-food', dietary: ['🧂 Low Sodium Available'],
      customizations: ['Salt Level', 'Protein Choice'],
    },
    {
      id: 'p2', name: 'Mac & Cheese Family Pan', price: 35.00, rating: 5.0,
      image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400',
      description: 'Creamy baked mac & cheese — feeds 4 to 6 people',
      category: 'soul-food', dietary: ['🥦 Vegetarian'],
      customizations: ['Portion Size'],
    },
    {
      id: 'p3', name: 'Collard Greens with Smoked Turkey', price: 15.00, rating: 4.8,
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
      description: 'Slow-cooked collard greens seasoned with smoked turkey',
      category: 'soul-food', dietary: ['🧂 Low Sodium Available'],
      customizations: ['Salt Level'],
    },
    {
      id: 'p4', name: 'Sweet Potato Pie (whole)', price: 25.00, rating: 5.0,
      image: 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?w=400',
      description: 'Grandma\'s recipe sweet potato pie — whole 9 inch',
      category: 'desserts', dietary: ['🥦 Vegetarian'],
      customizations: ['Sweetness'],
    },
  ],
  reviews: [
    { id: 'r1', name: 'Keisha M.', rating: 5, text: 'This is the best soul food I\'ve had since my grandmother passed. The mac and cheese had me in tears — the good kind.', date: '2 days ago', avatar: '👩🏾' },
    { id: 'r2', name: 'Marcus T.', rating: 5, text: 'Big Mama does NOT play. Every single order has been perfect. The collard greens are everything.', date: '1 week ago', avatar: '👨🏿' },
    { id: 'r3', name: 'Sandra L.', rating: 4, text: 'So glad I found this app. The fried chicken is crispy on the outside, juicy on the inside. Will order again!', date: '2 weeks ago', avatar: '👩🏽' },
  ],
};

const VendorProfile: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isFavorited, setIsFavorited] = useState(false);
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const vendor = SAMPLE_VENDOR;

  const handleAddToCart = (product: any) => {
    addToCart({
      foodItemId: product.id,
      foodName: product.name,
      vendorName: vendor.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image,
    });
    setAddedItems(prev => [...prev, product.id]);
    setTimeout(() => setAddedItems(prev => prev.filter(id => id !== product.id)), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Cover image with overlay */}
      <div className="relative h-56 overflow-hidden">
        <img src={vendor.coverImage} alt={vendor.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </button>

        {/* Share & favorite */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md">
            <Share2 className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
          </button>
        </div>

        {/* Tier badge */}
        {vendor.tier === 'kitchen' && (
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-orange-500 text-white">🚐 Kitchen Partner</Badge>
          </div>
        )}
      </div>

      {/* Vendor info card */}
      <div className="bg-white mx-4 -mt-6 rounded-2xl shadow-lg p-4 relative z-10 mb-4">
        <div className="flex items-start gap-3">
          <img
            src={vendor.avatar}
            alt={vendor.ownerName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-200 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-gray-900">{vendor.name}</h1>
              {vendor.isVerified && <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />}
            </div>
            <p className="text-sm text-orange-600 font-medium">{vendor.ownerName}</p>
            <p className="text-xs text-gray-500">{vendor.specialty}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-sm">{vendor.rating}</span>
            <span className="text-xs text-gray-400">({vendor.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm">{vendor.totalOrders} orders</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{vendor.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{vendor.city}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1 mt-3">
          <Badge className="bg-orange-50 text-orange-600 border border-orange-200 text-xs">{vendor.community}</Badge>
          {vendor.badges.map(b => (
            <Badge key={b} className="bg-gray-50 text-gray-600 border border-gray-200 text-xs">{b}</Badge>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-4 pb-8">

        {/* Vendor story */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className="w-5 h-5 text-orange-500" />
            <h2 className="font-bold text-gray-900">My Story</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{vendor.story}</p>
          <p className="text-xs text-gray-400 mt-2">Member since {vendor.memberSince}</p>
        </div>

        {/* Menu */}
        <div>
          <h2 className="font-bold text-gray-900 text-lg mb-3">Menu</h2>
          <div className="space-y-3">
            {vendor.products.map(product => (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex hover:shadow-md transition-all">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-28 h-28 object-cover flex-shrink-0"
                />
                <div className="flex-1 p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight flex-1 pr-2">{product.name}</h3>
                    <span className="font-black text-orange-600 text-base flex-shrink-0">${product.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-snug mb-2">{product.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.dietary.map(d => (
                      <span key={d} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">{d}</span>
                    ))}
                  </div>
                  {product.customizations.length > 0 && (
                    <p className="text-xs text-gray-400 mb-2">Options: {product.customizations.join(', ')}</p>
                  )}
                  <Button
                    onClick={() => handleAddToCart(product)}
                    size="sm"
                    className={`h-7 text-xs px-3 transition-all ${
                      addedItems.includes(product.id)
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-orange-500 hover:bg-orange-600'
                    } text-white`}
                  >
                    {addedItems.includes(product.id) ? '✓ Added!' : '+ Add to Cart'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-lg">Reviews</h2>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{vendor.rating}</span>
              <span className="text-gray-400 text-sm">({vendor.reviewCount})</span>
            </div>
          </div>
          <div className="space-y-3">
            {vendor.reviews.map(review => (
              <div key={review.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{review.avatar}</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{review.name}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
