import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Camera, DollarSign, Clock, ChefHat, Leaf, AlertTriangle } from 'lucide-react';

// ─── All categories including market items ───────────────────────────────────
const FOOD_CATEGORIES = [
  { id: 'soul-food', label: '🍗 Soul Food' },
  { id: 'latin', label: '🌮 Latino / Hispanic' },
  { id: 'caribbean', label: '🌴 Caribbean' },
  { id: 'east-asian', label: '🥟 East Asian' },
  { id: 'south-asian', label: '🍛 Desi / South Asian' },
  { id: 'jewish-kosher', label: '✡️ Jewish & Kosher' },
  { id: 'middle-eastern', label: '🧆 Middle Eastern' },
  { id: 'west-african', label: '🫙 West African' },
  { id: 'southeast-asian', label: '🍜 Southeast Asian' },
  { id: 'eastern-european', label: '🥣 Eastern European' },
  { id: 'halal', label: '🌙 Halal' },
  { id: 'vegan', label: '🌱 Vegan / Plant-Based' },
  { id: 'bakery', label: '🍞 Bakery' },
  { id: 'desserts', label: '🍪 Desserts & Sweets' },
  { id: 'beverages', label: '🥤 Beverages' },
  { id: 'jams-preserves', label: '🫙 Jams & Preserves' },
  { id: 'snacks', label: '🍿 Snacks' },
  // Market items
  { id: 'beauty-body', label: '🧴 Beauty & Body' },
  { id: 'candles', label: '🕯️ Candles & Aromatherapy' },
  { id: 'jewelry', label: '💎 Jewelry & Accessories' },
  { id: 'art-prints', label: '🎨 Art & Prints' },
  { id: 'textiles', label: '🧶 Textiles & Crafts' },
  { id: 'plants', label: '🌿 Plants & Garden' },
  { id: 'cultural-goods', label: '🏺 Cultural Goods' },
];

// ─── Dietary flags ────────────────────────────────────────────────────────────
const DIETARY_FLAGS = [
  { id: 'vegetarian', label: '🥦 Vegetarian', color: 'bg-green-100 text-green-700 border-green-300' },
  { id: 'vegan', label: '🌱 Vegan', color: 'bg-lime-100 text-lime-700 border-lime-300' },
  { id: 'gluten-free', label: '🌾 Gluten-Free', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { id: 'dairy-free', label: '🥛 Dairy-Free', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { id: 'nut-free', label: '🥜 Nut-Free', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { id: 'kosher', label: '✡️ Kosher', color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
  { id: 'halal', label: '🌙 Halal', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  { id: 'keto', label: '🥩 Keto', color: 'bg-red-100 text-red-700 border-red-300' },
  { id: 'diabetic-friendly', label: '💙 Diabetic-Friendly', color: 'bg-sky-100 text-sky-700 border-sky-300' },
  { id: 'low-sodium', label: '🧂 Low Sodium', color: 'bg-purple-100 text-purple-700 border-purple-300' },
];

// ─── Common allergens ─────────────────────────────────────────────────────────
const ALLERGENS = [
  'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts',
  'Peanuts', 'Wheat', 'Soybeans', 'Sesame',
];

// ─── Customer customization options ──────────────────────────────────────────
const CUSTOMIZATION_PRESETS = [
  {
    group: 'Salt',
    options: ['No Salt', 'Low Salt', 'Regular Salt', 'Extra Salt'],
  },
  {
    group: 'Spice Level',
    options: ['No Spice', 'Mild', 'Medium', 'Hot', 'Extra Hot'],
  },
  {
    group: 'Sweetness',
    options: ['No Sugar', 'Less Sweet', 'Regular', 'Extra Sweet'],
  },
  {
    group: 'Portion Size',
    options: ['Small', 'Regular', 'Large', 'Family Size'],
  },
  {
    group: 'Protein Choice',
    options: ['Chicken', 'Beef', 'Pork', 'Fish', 'Tofu / Vegan', 'No Meat'],
  },
  {
    group: 'Side Choice',
    options: ['Rice', 'Bread', 'Salad', 'Fries', 'No Side'],
  },
];

interface CustomizationGroup {
  group: string;
  options: string[];
  allowMultiple: boolean;
  required: boolean;
}

interface ProductFormProps {
  product?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const isMarketItem = (cat: string) =>
    ['beauty-body','candles','jewelry','art-prints','textiles','plants','cultural-goods'].includes(cat);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    ingredients: product?.ingredients || '',
    category: product?.category || '',
    price: product?.price || '',
    image_url: product?.image_url || '',
    inventory_count: product?.inventory_count || 0,
    is_available: product?.is_available ?? true,
    prep_time_min: product?.prep_time_min || 20,
    prep_time_max: product?.prep_time_max || 35,
    dietary_flags: product?.dietary_flags || [] as string[],
    allergens: product?.allergens || [] as string[],
    customizations: product?.customizations || [] as CustomizationGroup[],
    special_instructions_allowed: product?.special_instructions_allowed ?? true,
  });

  const [activeStep, setActiveStep] = useState(1);
  const [newCustomGroup, setNewCustomGroup] = useState('');
  const [newCustomOptions, setNewCustomOptions] = useState('');

  const toggleDietaryFlag = (flag: string) => {
    setFormData(prev => ({
      ...prev,
      dietary_flags: prev.dietary_flags.includes(flag)
        ? prev.dietary_flags.filter((f: string) => f !== flag)
        : [...prev.dietary_flags, flag],
    }));
  };

  const toggleAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter((a: string) => a !== allergen)
        : [...prev.allergens, allergen],
    }));
  };

  const addPresetCustomization = (preset: typeof CUSTOMIZATION_PRESETS[0]) => {
    const exists = formData.customizations.find((c: CustomizationGroup) => c.group === preset.group);
    if (!exists) {
      setFormData(prev => ({
        ...prev,
        customizations: [...prev.customizations, {
          group: preset.group,
          options: preset.options,
          allowMultiple: false,
          required: false,
        }],
      }));
    }
  };

  const removeCustomization = (group: string) => {
    setFormData(prev => ({
      ...prev,
      customizations: prev.customizations.filter((c: CustomizationGroup) => c.group !== group),
    }));
  };

  const addCustomGroup = () => {
    if (!newCustomGroup || !newCustomOptions) return;
    const options = newCustomOptions.split(',').map(o => o.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      customizations: [...prev.customizations, {
        group: newCustomGroup,
        options,
        allowMultiple: false,
        required: false,
      }],
    }));
    setNewCustomGroup('');
    setNewCustomOptions('');
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isFoodItem = !isMarketItem(formData.category);
  const totalSteps = isFoodItem ? 4 : 3;

  const stepTitles = [
    '📝 Basic Info',
    isFoodItem ? '🥗 Dietary & Allergens' : null,
    '⚙️ Customer Options',
    '✅ Review & Save',
  ].filter(Boolean);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <ChefHat className="w-5 h-5" />
          <h3 className="font-bold text-lg">{product ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
        </div>
        <button onClick={onCancel} className="text-white/80 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex border-b border-gray-100 bg-gray-50">
        {stepTitles.map((title, i) => (
          <button
            key={i}
            onClick={() => setActiveStep(i + 1)}
            className={`flex-1 py-3 text-xs font-medium transition-colors ${
              activeStep === i + 1
                ? 'text-orange-600 border-b-2 border-orange-500 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {title}
          </button>
        ))}
      </div>

      <div className="p-6 max-h-[65vh] overflow-y-auto">

        {/* ── STEP 1: Basic Info ───────────────────────────── */}
        {activeStep === 1 && (
          <div className="space-y-4">
            {/* Category */}
            <div>
              <Label className="font-semibold">Category *</Label>
              <p className="text-xs text-gray-500 mb-2">What type of item is this?</p>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {FOOD_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({...formData, category: cat.id})}
                    className={`px-3 py-2 rounded-lg text-xs text-left border transition-all ${
                      formData.category === cat.id
                        ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold'
                        : 'border-gray-200 hover:border-orange-300 text-gray-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name" className="font-semibold">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Mama's Jerk Chicken Plate"
                className="mt-1 focus:border-orange-400"
              />
            </div>

            {/* Description */}
            <div>
              <Label className="font-semibold">Description *</Label>
              <Textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Tell customers what makes this special. Your story sells!"
                rows={3}
                className="mt-1 focus:border-orange-400"
              />
              <p className="text-xs text-gray-400 mt-1">{formData.description.length}/200 — Be descriptive, customers love the story behind the food</p>
            </div>

            {/* Price & Prep Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="font-semibold">Price *</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="pl-8 focus:border-orange-400"
                    placeholder="0.00"
                  />
                </div>
              </div>
              {isFoodItem && (
                <div>
                  <Label className="font-semibold">Prep Time</Label>
                  <div className="relative mt-1">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={`${formData.prep_time_min}-${formData.prep_time_max}`}
                      onChange={e => {
                        const [min, max] = e.target.value.split('-').map(Number);
                        setFormData({...formData, prep_time_min: min, prep_time_max: max});
                      }}
                      className="w-full pl-8 py-2 border border-gray-200 rounded-lg text-sm focus:border-orange-400 focus:outline-none"
                    >
                      <option value="10-20">10–20 min</option>
                      <option value="20-30">20–30 min</option>
                      <option value="25-35">25–35 min</option>
                      <option value="30-45">30–45 min</option>
                      <option value="45-60">45–60 min</option>
                      <option value="60-90">1–1.5 hrs</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Image URL */}
            <div>
              <Label className="font-semibold">Photo</Label>
              <div className="mt-1 flex gap-2">
                <div className="relative flex-1">
                  <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={formData.image_url}
                    onChange={e => setFormData({...formData, image_url: e.target.value})}
                    placeholder="Paste a photo link or upload below"
                    className="pl-8 focus:border-orange-400"
                  />
                </div>
              </div>
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="mt-2 h-24 w-full object-cover rounded-lg border" />
              )}
              <p className="text-xs text-orange-600 mt-1">💡 Tip: Items with photos get 3x more orders!</p>
            </div>

            {/* Inventory */}
            <div>
              <Label className="font-semibold">How many can you make today?</Label>
              <Input
                type="number"
                min="0"
                value={formData.inventory_count}
                onChange={e => setFormData({...formData, inventory_count: parseInt(e.target.value) || 0})}
                className="mt-1 focus:border-orange-400"
                placeholder="Leave at 0 for unlimited"
              />
              <p className="text-xs text-gray-400 mt-1">0 = unlimited. Set a number to cap orders so you're never overwhelmed.</p>
            </div>

            {/* Ingredients (food only) */}
            {isFoodItem && (
              <div>
                <Label className="font-semibold">Ingredients</Label>
                <Textarea
                  value={formData.ingredients}
                  onChange={e => setFormData({...formData, ingredients: e.target.value})}
                  placeholder="List your main ingredients — helps customers with dietary needs"
                  rows={2}
                  className="mt-1 focus:border-orange-400"
                />
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Dietary & Allergens (food only) ──────── */}
        {activeStep === 2 && isFoodItem && (
          <div className="space-y-5">

            {/* Dietary flags */}
            <div>
              <Label className="font-semibold flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-500" />
                Dietary Labels
              </Label>
              <p className="text-xs text-gray-500 mb-3">Check everything that applies — this helps customers with dietary needs find your food</p>
              <div className="flex flex-wrap gap-2">
                {DIETARY_FLAGS.map(flag => (
                  <button
                    key={flag.id}
                    type="button"
                    onClick={() => toggleDietaryFlag(flag.id)}
                    className={`px-3 py-1.5 rounded-full text-xs border font-medium transition-all ${
                      formData.dietary_flags.includes(flag.id)
                        ? flag.color + ' shadow-sm scale-105'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {flag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Allergens */}
            <div>
              <Label className="font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Contains These Allergens
              </Label>
              <p className="text-xs text-gray-500 mb-3">Required by law — check everything your recipe contains</p>
              <div className="flex flex-wrap gap-2">
                {ALLERGENS.map(allergen => (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => toggleAllergen(allergen)}
                    className={`px-3 py-1.5 rounded-full text-xs border font-medium transition-all ${
                      formData.allergens.includes(allergen)
                        ? 'bg-red-100 text-red-700 border-red-300 shadow-sm'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-red-200'
                    }`}
                  >
                    {allergen}
                  </button>
                ))}
              </div>
            </div>

            {/* Illinois cottage food notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-blue-800 font-semibold text-sm mb-1">📋 Illinois Cottage Food Label Requirements</p>
              <p className="text-blue-700 text-xs leading-relaxed">
                Your product label must include: your business name, county registered in, registration number,
                all ingredients listed by weight, allergens, and the statement:
                <em> "This product was produced in a home kitchen not inspected by a health department."</em>
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 3: Customer Options ──────────────────────── */}
        {((activeStep === 3 && isFoodItem) || (activeStep === 2 && !isFoodItem)) && (
          <div className="space-y-5">
            <div>
              <Label className="font-semibold">Customer Customization Options</Label>
              <p className="text-xs text-gray-500 mb-3">
                What choices can customers make when ordering?
                {isFoodItem ? ' e.g. no salt, spice level, protein choice' : ' e.g. color, size, scent'}
              </p>
            </div>

            {/* Quick-add presets for food */}
            {isFoodItem && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Quick add common options:</p>
                <div className="flex flex-wrap gap-2">
                  {CUSTOMIZATION_PRESETS.map(preset => {
                    const added = formData.customizations.find((c: CustomizationGroup) => c.group === preset.group);
                    return (
                      <button
                        key={preset.group}
                        type="button"
                        onClick={() => addPresetCustomization(preset)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                          added
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'
                        }`}
                      >
                        {added ? '✓ ' : '+ '}{preset.group}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active customizations */}
            {formData.customizations.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-600">Added options:</p>
                {formData.customizations.map((custom: CustomizationGroup) => (
                  <div key={custom.group} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-gray-800">{custom.group}</span>
                      <button onClick={() => removeCustomization(custom.group)}
                        className="text-red-400 hover:text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {custom.options.map((opt: string) => (
                        <span key={opt} className="bg-white border border-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Custom group builder */}
            <div className="border border-dashed border-gray-300 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-600 mb-2">Add your own option:</p>
              <div className="space-y-2">
                <Input
                  value={newCustomGroup}
                  onChange={e => setNewCustomGroup(e.target.value)}
                  placeholder="Option name (e.g. Color, Scent, Add-ons)"
                  className="text-sm focus:border-orange-400"
                />
                <Input
                  value={newCustomOptions}
                  onChange={e => setNewCustomOptions(e.target.value)}
                  placeholder="Choices separated by commas (e.g. Red, Blue, Green)"
                  className="text-sm focus:border-orange-400"
                />
                <Button
                  type="button"
                  onClick={addCustomGroup}
                  variant="outline"
                  size="sm"
                  className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Option Group
                </Button>
              </div>
            </div>

            {/* Special instructions toggle */}
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div>
                <p className="font-semibold text-sm text-gray-800">Allow special instructions</p>
                <p className="text-xs text-gray-500">Customers can type a personal request — "no onions", "extra sauce" etc.</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({...formData, special_instructions_allowed: !formData.special_instructions_allowed})}
                className={`w-11 h-6 rounded-full transition-colors ${
                  formData.special_instructions_allowed ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${
                  formData.special_instructions_allowed ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Review & Save ─────────────────────────── */}
        {((activeStep === 4 && isFoodItem) || (activeStep === 3 && !isFoodItem)) && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 font-medium">Review your menu item before saving:</p>

            <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              {formData.image_url && (
                <img src={formData.image_url} alt={formData.name} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg text-gray-900">{formData.name || 'Item Name'}</h4>
                  <span className="text-xl font-bold text-orange-600">${Number(formData.price || 0).toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{formData.description}</p>

                {formData.dietary_flags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {formData.dietary_flags.map((flag: string) => {
                      const f = DIETARY_FLAGS.find(d => d.id === flag);
                      return f ? <Badge key={flag} className={`text-xs ${f.color} border`}>{f.label}</Badge> : null;
                    })}
                  </div>
                )}

                {formData.allergens.length > 0 && (
                  <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 mb-2">
                    ⚠️ Contains: {formData.allergens.join(', ')}
                  </p>
                )}

                {formData.customizations.length > 0 && (
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Customer options: </span>
                    {formData.customizations.map((c: CustomizationGroup) => c.group).join(', ')}
                  </div>
                )}

                {isFoodItem && (
                  <p className="text-xs text-gray-400 mt-2">⏱ Prep time: {formData.prep_time_min}–{formData.prep_time_max} min</p>
                )}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-green-700 font-semibold text-sm">✅ Looks good!</p>
              <p className="text-green-600 text-xs mt-1">Your item will be live on the app immediately after saving.</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="border-t border-gray-100 p-4 flex gap-3 bg-gray-50">
        {activeStep > 1 && (
          <Button type="button" variant="outline" onClick={() => setActiveStep(s => s - 1)} className="flex-1">
            ← Back
          </Button>
        )}
        {activeStep < (isFoodItem ? 4 : 3) ? (
          <Button
            type="button"
            onClick={() => setActiveStep(s => s + 1)}
            disabled={activeStep === 1 && (!formData.name || !formData.price || !formData.category)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
          >
            Next →
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
          >
            ✅ Save Menu Item
          </Button>
        )}
        {activeStep === 1 && (
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        )}
      </div>
    </div>
  );
};
