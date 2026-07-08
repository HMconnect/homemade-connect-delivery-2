import React, { useState } from 'react';
import { Star, Clock, MapPin } from 'lucide-react';
import { StarRating } from './reviews/StarRating';

interface FoodCardProps {
  id: string;
  name: string;
  vendor: string;
  image: string;
  price: number;
  rating: number;
  reviewCount?: number;
  prepTime: string;
  distance: string;
  description: string;
  isSample?: boolean;
  onClick: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({
  name,
  vendor,
  image,
  price,
  rating,
  reviewCount,
  prepTime,
  distance,
  description,
  isSample = true,
  onClick
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
    <div
      className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={handleClick}
    >
      {showNotice && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 p-4">
          <p className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-gray-800 shadow-lg">
            This is a sample item — real local vendors are coming soon! 🍰
          </p>
        </div>
      )}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isSample && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <span className="-rotate-12 rounded-lg border-4 border-red-500/70 bg-white/70 px-6 py-1 text-2xl font-extrabold tracking-widest text-red-500/80">
              SAMPLE
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="text-sm font-semibold text-green-600">${price}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </div>

        <p className="text-sm text-blue-600 font-medium mb-2">{vendor}</p>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <StarRating rating={rating} size={16} />
            <span className="font-medium">{rating.toFixed(1)}</span>
            {reviewCount !== undefined && (
              <span className="text-gray-400">({reviewCount})</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{prepTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{distance}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { FoodCard };
export default FoodCard;
