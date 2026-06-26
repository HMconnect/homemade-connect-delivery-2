import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SUPPORTED_STATES } from '@/lib/constants';

const VENDOR_TYPES = [
  { id: 'food', emoji: '🍽️', label: 'Food Vendor', description: 'Home-cooked meals, baked goods, beverages' },
  { id: 'beauty', emoji: '🧴', label: 'Beauty & Body', description: 'Soaps, lotions, hair care, skin care' },
  { id: 'candles', emoji: '🕯️', label: 'Candles & Aromatherapy', description: 'Candles, incense, essential oils' },
  { id: 'jewelry', emoji: '💎', label: 'Jewelry & Accessories', description: 'Handmade jewelry, waist beads, accessories' },
  { id: 'art', emoji: '🎨', label: 'Art & Prints', description: 'Art prints, cultural décor, greeting cards' },
  { id: 'textiles', emoji: '🧶', label: 'Textiles & Crafts', description: 'Crochet, knitting, quilts, clothing' },
  { id: 'plants', emoji: '🌿', label: 'Plants & Garden', description: 'Plants, herbs, seeds, natural products' },
  { id: 'cultural', emoji: '🏺', label: 'Cultural Goods', description: 'Spices, cultural items, specialty goods' },
];

const COMMUNITY_TAGS = [
  '🍗 Soul Food', '🌮 Latino/Hispanic', '🌴 Caribbean', '家常菜 East Asian',
  '🍛 Desi/South Asian', '✡️ Jewish/Kosher', '🧆 Middle Eastern',
  '🫙 West African', '🍜 Southeast Asian', '🥣 Eastern European',
  '🌙 Halal', '🌱 Vegan/Plant-Based', '🏘️ General Community',
];

interface BusinessInfoStepProps {
  data: {
    businessName: string;
    businessDescription: string;
    businessAddress: string;
    businessPhone: string;
    vendorType?: string;
    communityTag?: string;
    state?: string;
    city?: string;
  };
  onChange: (field: string, value: string) => void;
}

export function BusinessInfoStep({ data, onChange }: BusinessInfoStepProps) {
  const selectedState = SUPPORTED_STATES.find(s => s.code === (data.state || 'IL'));

  return (
    <div className="space-y-5">

      {/* Vendor Type Selection */}
      <div>
        <Label className="text-base font-semibold">What do you sell? *</Label>
        <p className="text-sm text-gray-500 mb-3">Select the category that best describes your products</p>
        <div className="grid grid-cols-2 gap-2">
          {VENDOR_TYPES.map(type => (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange('vendorType', type.id)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                data.vendorType === type.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300 bg-white'
              }`}
            >
              <div className="text-xl mb-0.5">{type.emoji}</div>
              <div className="text-sm font-semibold text-gray-800 leading-tight">{type.label}</div>
              <div className="text-xs text-gray-500 leading-tight mt-0.5">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Community Tag */}
      <div>
        <Label className="text-base font-semibold">Community / Cultural Background</Label>
        <p className="text-sm text-gray-500 mb-2">Help customers find authentic food and goods from their community</p>
        <div className="flex flex-wrap gap-2">
          {COMMUNITY_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => onChange('communityTag', tag)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                data.communityTag === tag
                  ? 'border-orange-500 bg-orange-500 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
              }`}
              style={{fontFamily: 'serif'}}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* State & City */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="state">State *</Label>
          <select
            id="state"
            value={data.state || 'IL'}
            onChange={(e) => { onChange('state', e.target.value); onChange('city', ''); }}
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-orange-400 focus:outline-none"
          >
            {SUPPORTED_STATES.map(s => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="city">City *</Label>
          <select
            id="city"
            value={data.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-orange-400 focus:outline-none"
          >
            <option value="">Select city...</option>
            {(selectedState?.cities || []).map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Business Name */}
      <div>
        <Label htmlFor="businessName">Business Name *</Label>
        <Input
          id="businessName"
          value={data.businessName}
          onChange={(e) => onChange('businessName', e.target.value)}
          placeholder="e.g. Mama Rosa's Tamales, Adisa's Jewelry"
          className="mt-1 focus:border-orange-400"
          required
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="businessDescription">Tell us about your products *</Label>
        <Textarea
          id="businessDescription"
          value={data.businessDescription}
          onChange={(e) => onChange('businessDescription', e.target.value)}
          placeholder="Describe what you make, your inspiration, and what makes your products special..."
          rows={4}
          className="mt-1 focus:border-orange-400"
          required
        />
      </div>

      {/* Address & Phone */}
      <div>
        <Label htmlFor="businessAddress">Your Address *</Label>
        <Input
          id="businessAddress"
          value={data.businessAddress}
          onChange={(e) => onChange('businessAddress', e.target.value)}
          placeholder="123 Main St, Chicago, IL 60601"
          className="mt-1 focus:border-orange-400"
          required
        />
      </div>

      <div>
        <Label htmlFor="businessPhone">Phone Number *</Label>
        <Input
          id="businessPhone"
          type="tel"
          value={data.businessPhone}
          onChange={(e) => onChange('businessPhone', e.target.value)}
          placeholder="(312) 555-0123"
          className="mt-1 focus:border-orange-400"
          required
        />
      </div>

      {/* First 100 vendors bonus notice */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
        <p className="text-orange-700 font-semibold text-sm">🎉 First 100 Vendors Bonus!</p>
        <p className="text-orange-600 text-xs mt-1">
          Join as one of our first 100 vendors and receive a <strong>$10 credit</strong> applied to your first month.
        </p>
      </div>
    </div>
  );
}
