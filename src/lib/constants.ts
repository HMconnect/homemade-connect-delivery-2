// Homemade Connect Delivery — App Constants

export const APP_NAME = 'Homemade Connect Delivery';
export const APP_SHORT_NAME = 'HomemadeConnect';
export const APP_TAGLINE = 'Fresh from Local Home Kitchens';
export const APP_WEBSITE = 'https://www.homemadeconnectdelivery.com';
export const APP_EMAIL = 'info@homemadeconnectdelivery.com';
export const APP_SUPPORT_EMAIL = 'info@homemadeconnectdelivery.com';

export const SUPPORTED_STATES = [
  { code: 'IL', name: 'Illinois', cities: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford', 'Springfield'] },
  { code: 'GA', name: 'Georgia', cities: ['Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens', 'Macon'] },
  { code: 'WI', name: 'Wisconsin', cities: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton'] },
  { code: 'MI', name: 'Michigan', cities: ['Detroit', 'Grand Rapids', 'Ann Arbor', 'Lansing', 'Flint', 'Dearborn'] },
];

export const FIRST_VENDOR_BONUS_COUNT = 100;
export const FIRST_VENDOR_BONUS_AMOUNT = 10;

// Customer Subscription Tiers
export const CUSTOMER_TIERS = {
  free: {
    id: 'free',
    name: 'Community Supporter',
    price: 0,
    deliveryFee: 3.99,
    perks: [
      'Access to all vendors in your state',
      'Pay $3.99 delivery fee per order',
      'View vendor stories and profiles',
    ],
    color: 'gray',
  },
  member: {
    id: 'member',
    name: 'Homemade Member',
    price: 9.99,
    deliveryFee: 0,
    perks: [
      'Free delivery on all orders',
      'Priority delivery during peak hours',
      'Early access to new vendors',
      '$5 monthly credit toward any order',
      'Member badge on profile',
    ],
    color: 'blue',
  },
  coop: {
    id: 'coop',
    name: 'Co-op Community Member',
    price: 19.99,
    deliveryFee: 0,
    discount: 0.10,
    perks: [
      'Everything in Homemade Member',
      '10% off every order always',
      'Direct connection to your vendors',
      'Vote on co-op decisions',
      'Co-op Community badge',
      'Listed on Community Wall',
    ],
    color: 'green',
  },
};

// Vendor Membership Tiers
export const VENDOR_TIERS = {
  basic: {
    id: 'basic',
    name: 'Basic Vendor',
    price: 50,
    perks: [
      'List products on app',
      'Accept orders',
      'Standard placement',
      'Vendor dashboard',
    ],
  },
  coop: {
    id: 'coop',
    name: 'Co-op Vendor',
    price: 100,
    perks: [
      'Everything in Basic',
      'Co-ownership stake building',
      'Voting rights in co-op decisions',
      'Priority placement',
    ],
  },
  kitchen: {
    id: 'kitchen',
    name: 'Kitchen Partner',
    price: 150,
    perks: [
      'Everything in Co-op',
      'Scheduled trailer kitchen time slots',
      'Co-ownership deed in shared kitchen',
      'Featured vendor placement',
      'Kitchen Hub access',
    ],
  },
};

// Driver Pay Model
export const DRIVER_PAY = {
  basePayMin: 3.50,
  basePayMax: 5.00,
  perMileRate: 0.75,
  peakBonus: 1.50,
  milestoneDeliveries: 50,
  milestoneBonusMin: 25,
  milestoneBonusMax: 50,
};

// Kitchen Co-op
export const KITCHEN_COOP = {
  vendorsNeededPerTrailer: 10,
  estimatedTrailerCost: 20000,
  churchPartnershipFee: 250,
};
