import React, { useRef } from 'react';
import { COMMUNITIES } from '@/lib/communities';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CommunityShowcaseProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

export const CommunityShowcase: React.FC<CommunityShowcaseProps> = ({ onSelectCategory, selectedCategory }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Our Community Kitchens</h2>
          <p className="text-sm text-gray-500">Authentic homemade food from every culture</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-orange-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-orange-400 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* All button */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex-shrink-0 w-28 h-32 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
            selectedCategory === 'all'
              ? 'border-orange-500 bg-orange-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm'
          }`}
        >
          <span className="text-3xl">🍽️</span>
          <span className="text-xs font-bold text-gray-700">All Food</span>
          <span className="text-xs text-gray-400">Everything</span>
        </button>

        {COMMUNITIES.map((community) => (
          <button
            key={community.id}
            onClick={() => onSelectCategory(community.category)}
            className={`flex-shrink-0 w-28 h-32 rounded-2xl border-2 overflow-hidden transition-all relative ${
              selectedCategory === community.category
                ? 'border-orange-500 shadow-lg scale-105'
                : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
            }`}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${community.color} opacity-90`} />

            <div className="relative h-full flex flex-col items-center justify-center gap-1 px-2 py-3">
              {/* Native script */}
              {community.script && (
                <div className="text-white/90 text-center leading-tight mb-1"
                  style={{
                    fontSize: community.script.length > 6 ? '11px' : '13px',
                    fontFamily: community.id === 'east-asian' || community.id === 'south-asian' || community.id === 'middle-eastern' || community.id === 'jewish-kosher' || community.id === 'west-african' || community.id === 'eastern-european'
                      ? 'serif'
                      : 'inherit',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {community.script}
                </div>
              )}
              {/* Emoji */}
              <span className="text-2xl">{community.emoji}</span>
              {/* English name */}
              <span className="text-white text-xs font-bold text-center leading-tight" style={{textShadow: '0 1px 2px rgba(0,0,0,0.4)'}}>
                {community.name}
              </span>
            </div>

            {/* Selected indicator */}
            {selectedCategory === community.category && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
