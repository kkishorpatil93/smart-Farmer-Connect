/**
 * ==============================================================================
 * SMART FARMER CONNECT: AGRICULTURAL UNIT CONVERSION & PRICING ENGINE
 * ==============================================================================
 * Constants:
 *  - 1 quintal = 100 kg
 *  - 1 tonne   = 1,000 kg
 * ==============================================================================
 */

export type WeightUnit = 'kg' | 'quintal' | 'tonne';

export const UNIT_CONVERSIONS_TO_KG: Record<WeightUnit, number> = {
  kg: 1,
  quintal: 100,
  tonne: 1000,
};

/**
 * Normalizes any entered quantity to standard kilograms (kg)
 */
export function normalizeToKg(quantity: number, unit: WeightUnit): number {
  if (quantity < 0) {
    throw new Error('Quantity cannot be negative');
  }
  const factor = UNIT_CONVERSIONS_TO_KG[unit];
  if (!factor) {
    throw new Error(`Unsupported weight unit: ${unit}`);
  }
  return Number((quantity * factor).toFixed(2));
}

/**
 * Normalizes any entered price (e.g. ₹2,200 per quintal) to standard ₹ per kg
 */
export function normalizePricePerKg(price: number, priceUnit: WeightUnit): number {
  if (price < 0) {
    throw new Error('Price cannot be negative');
  }
  const factor = UNIT_CONVERSIONS_TO_KG[priceUnit];
  if (!factor) {
    throw new Error(`Unsupported price unit: ${priceUnit}`);
  }
  return Number((price / factor).toFixed(2));
}

/**
 * Converts standard kilograms (kg) back into the farmer's preferred display unit
 */
export function convertFromKg(quantityKg: number, targetUnit: WeightUnit): number {
  if (quantityKg < 0) {
    throw new Error('Quantity in kg cannot be negative');
  }
  const factor = UNIT_CONVERSIONS_TO_KG[targetUnit];
  return Number((quantityKg / factor).toFixed(2));
}

/**
 * Calculates the total expected payout for a crop lot
 */
export function calculateTotalValue(quantityKg: number, pricePerKg: number): number {
  if (quantityKg < 0 || pricePerKg < 0) {
    throw new Error('Quantity and price must be non-negative');
  }
  return Number((quantityKg * pricePerKg).toFixed(2));
}

/**
 * Formats a monetary value in Indian Rupee format (e.g. ₹78,000)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
