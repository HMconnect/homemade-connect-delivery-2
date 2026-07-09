import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, ShoppingBag } from 'lucide-react';

interface MarketItemCardProps {
  id: string;
  name: string;
  vendor_name: string;
  price: number;
  rating: number;
  image_url: string;
  category: string;
  description: string;
  isSample?: boolean;
  onClick: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  'beauty-body': '🧴 Beauty',
  'candles': '🕯️ Candles',
  'jewelry': '💎 Jewelry',
  'art-prints': '🎨 Art',
  'textiles': '🧶 Textiles',
  'plants': '🌿 Plants',
  'cultural-goods': '🏺 Cultural',
};

export const MarketItemCard: React.FC<MarketItemCardProps> = ({
  name, vendor_name, price, rating, image_url, category, description, isSample = true, onClick
}) => {
  const [showNotice, setShowNotice] = useState(false);

  const handleClick = () => {
    if (isSample) {
      setShowNotice(true);
      window.setTimeout(() => setShowNotice(false), 3000);
      return;
    }
    onClick();
  };

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
      {showNotice && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 p-4">
          <p className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-gray-800 shadow-lg">
            This is a sample item — real local makers are coming soon! 🛍️
          </p>
        </div>
      )}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image_url}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=400'; }}
        />
        {isSample && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <span className="-rotate-12 rounded-lg border-4 border-red-500/70 bg-white/70 px-6 py-1 text-2xl font-extrabold tracking-widest text-red-500/80">
              SAMPLE
            </span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge className="bg-white/90 text-gray-700 text-xs border-0 shadow-sm">
            {CATEGORY_LABELS[category] || '🛍️ Goods'}
          </Badge>
        </div>
        <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-0.5 flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-gray-700">{rating}</span>
        </div>
        {/* Same-day delivery badge */}
        <div className="absolute bottom-2 left-2">
          <div className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            Same-Day Delivery
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs text-orange-600 font-medium mb-0.5">{vendor_name}</p>
        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{name}</h3>
        <p className="text-xs text-gray-500 leading-tight mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">${price.toFixed(2)}</span>
          <Button
            onClick={handleClick}
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white h-8 text-xs px-3"
          >
            <ShoppingBag className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};
