import React from 'react';
import { Star, Clock, MapPin, Award } from 'lucide-react';
import { StarRating } from './reviews/StarRating';


interface VendorCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount?: number;
  deliveryTime: string;
  distance: string;
  specialty: string;
  isPartner: boolean;
  onClick: () => void;
}

const VendorCard: React.FC<VendorCardProps> = ({
  name,
  image,
  rating,
  reviewCount,
  deliveryTime,
  distance,
  specialty,
  isPartner,
  onClick
}) => {

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group p-4"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <img 
            src={image} 
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
          {isPartner && (
            <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-1">
              <Award className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-1 text-sm">
              <StarRating rating={rating} size={14} />
              <span className="font-medium">{rating.toFixed(1)}</span>
              {reviewCount !== undefined && (
                <span className="text-gray-400 text-xs">({reviewCount})</span>
              )}
            </div>
          </div>

          
          <p className="text-sm text-gray-600 mb-2">{specialty}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{distance}</span>
            </div>
            {isPartner && (
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                Partner
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { VendorCard };
export default VendorCard;