// Cottage food legal compliance data.
//
// Consumed by the vendor application flow (TermsStep) and the checkout
// components to surface the state-specific legal disclaimers, prohibited
// items, and packaging rules that cottage food vendors must follow.

export interface StateCompliance {
  /** Two-letter state code / label shown to the user. */
  state: string;
  /** Legal disclaimer that must appear on every product listing. */
  disclaimer: string;
  /** Whether the state requires direct customer messaging before purchase. */
  requiresChat: boolean;
  /** Items that may never be sold under the state's cottage food law. */
  prohibitedFoods: string[];
  /** Labeling / packaging requirements for compliant listings. */
  packagingRequirements: string[];
}

const COMMON_PROHIBITED_FOODS = [
  'Meat, poultry, or seafood products',
  'Dairy-based items requiring refrigeration (cheesecakes, cream pies, custards)',
  'Canned or pickled low-acid vegetables',
  'Foods requiring time or temperature control for safety',
  'Alcohol-infused products',
];

const COMMON_PACKAGING_REQUIREMENTS = [
  'Product name and the ingredients in descending order by weight',
  'Net weight or volume of the product',
  'Name and address of the cottage food operation',
  'Allergen declaration (milk, eggs, wheat, soy, peanuts, tree nuts, fish, shellfish)',
  'The state-required "made in a home kitchen" disclaimer',
];

export const STATE_COMPLIANCE: Record<string, StateCompliance> = {
  IL: {
    state: 'IL',
    disclaimer:
      'This product was produced in a home kitchen not subject to public health inspection that may also process common food allergens.',
    requiresChat: false,
    prohibitedFoods: COMMON_PROHIBITED_FOODS,
    packagingRequirements: COMMON_PACKAGING_REQUIREMENTS,
  },
  MI: {
    state: 'MI',
    disclaimer:
      'Made in a home kitchen that has not been inspected by the Michigan Department of Agriculture and Rural Development.',
    requiresChat: true,
    prohibitedFoods: COMMON_PROHIBITED_FOODS,
    packagingRequirements: COMMON_PACKAGING_REQUIREMENTS,
  },
  TX: {
    state: 'TX',
    disclaimer:
      'This food is made in a home kitchen and is not inspected by the Department of State Health Services or a local health department.',
    requiresChat: false,
    prohibitedFoods: COMMON_PROHIBITED_FOODS,
    packagingRequirements: COMMON_PACKAGING_REQUIREMENTS,
  },
  CA: {
    state: 'CA',
    disclaimer:
      'Made in a home kitchen with a Cottage Food registration or permit and not subject to routine government food safety inspection.',
    requiresChat: false,
    prohibitedFoods: COMMON_PROHIBITED_FOODS,
    packagingRequirements: COMMON_PACKAGING_REQUIREMENTS,
  },
  FL: {
    state: 'FL',
    disclaimer:
      'Made in a cottage food operation that is not subject to Florida’s food safety regulations.',
    requiresChat: false,
    prohibitedFoods: COMMON_PROHIBITED_FOODS,
    packagingRequirements: COMMON_PACKAGING_REQUIREMENTS,
  },
};

export const TERMS_OF_SERVICE_CLAUSES: string[] = [
  'I am a legally registered cottage food vendor and hold any license or permit my state requires.',
  'I will only sell non-hazardous foods that are permitted under my state’s cottage food law.',
  'I will accurately label every product with its ingredients, net weight, allergens, and the required home-kitchen disclaimer.',
  'I will prepare and store all products in a manner that follows applicable food safety and sanitation standards.',
  'I am solely responsible for the safety, quality, and legal compliance of the products I list and sell.',
  'I will honor the prices, availability, and fulfillment times shown on my listings.',
  'I will respond to customer inquiries promptly and resolve disputes in good faith.',
  'I understand the platform is a marketplace facilitator and is not the manufacturer or seller of my products.',
  'I will indemnify and hold the platform harmless from claims arising out of the products I sell.',
  'I understand that violating these terms or applicable law may result in removal from the platform.',
];
