import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 20,
  interactive = false,
  onRatingChange 
}: StarRatingProps) {
  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }, (_, i) => {
        const value = i + 1;
        const isFilled = value <= rating;
        const isHalf = value - 0.5 === rating;
        
        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(value)}
            disabled={!interactive}
            className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
          >
            <Star
              size={size}
              className={isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          </button>
        );
      })}
    </div>
  );
}
