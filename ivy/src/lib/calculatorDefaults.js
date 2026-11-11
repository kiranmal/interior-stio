// Fallback values used until the admin saves their own (and if the API is unreachable).
// These match the numbers that were previously hard-coded in CostCalculator.jsx.
export const DEFAULT_CALCULATOR = {
  minArea: 300,
  maxArea: 20000,
  defaultFinish: 'Premium',
  // rate = ₹ per sq ft (carpet area). rangeAdd = extra ₹ per sq ft added to get the upper end of the range.
  finishLevels: [
    { name: 'Standard', rate: 1400, rangeAdd: 400 },
    { name: 'Premium', rate: 2000, rangeAdd: 400 },
    { name: 'Luxury', rate: 2800, rangeAdd: 400 },
  ],
  // factor converts the entered area into carpet-area equivalent (Carpet = 1).
  areaTypes: [
    { name: 'Carpet Area', factor: 1 },
    { name: 'Built-up Area', factor: 0.85 },
    { name: 'Super Built-up Area', factor: 0.7 },
  ],
  // multiplier scales the final price for that property type (1 = no change).
  propertyTypes: [
    { name: '1 BHK', multiplier: 1 },
    { name: '2 BHK', multiplier: 1 },
    { name: '3 BHK', multiplier: 1 },
    { name: '4 BHK +', multiplier: 1 },
    { name: 'Villa', multiplier: 1 },
    { name: 'Office', multiplier: 1 },
  ],
  disclaimer: 'Final cost depends on scope, materials and site conditions.',
  successMessage: 'Thank you. We will call you with a detailed estimate.',
};
