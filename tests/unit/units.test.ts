import { describe, it, expect } from 'vitest';
import {
  normalizeToKg,
  normalizePricePerKg,
  convertFromKg,
  calculateTotalValue,
  formatCurrency,
} from '../../src/lib/utils/units';

describe('Agricultural Unit Conversion Engine', () => {
  it('correctly converts quintals and tonnes to standard kilograms', () => {
    // 1 quintal = 100 kg
    expect(normalizeToKg(5, 'quintal')).toBe(500);
    expect(normalizeToKg(0.5, 'quintal')).toBe(50);

    // 1 tonne = 1000 kg
    expect(normalizeToKg(3, 'tonne')).toBe(3000);
    expect(normalizeToKg(1.25, 'tonne')).toBe(1250);

    // kg stays kg
    expect(normalizeToKg(75, 'kg')).toBe(75);
  });

  it('correctly normalizes price per unit to standard price per kg', () => {
    // ₹2,200 per quintal (100 kg) -> ₹22 per kg
    expect(normalizePricePerKg(2200, 'quintal')).toBe(22);

    // ₹26,000 per tonne (1000 kg) -> ₹26 per kg
    expect(normalizePricePerKg(26000, 'tonne')).toBe(26);

    // ₹45 per kg -> ₹45 per kg
    expect(normalizePricePerKg(45, 'kg')).toBe(45);
  });

  it('converts kilograms back to display units without precision loss', () => {
    expect(convertFromKg(500, 'quintal')).toBe(5);
    expect(convertFromKg(3000, 'tonne')).toBe(3);
    expect(convertFromKg(150, 'kg')).toBe(150);
  });

  it('calculates total expected payout correctly', () => {
    // 500 kg at ₹22/kg = ₹11,000
    expect(calculateTotalValue(500, 22)).toBe(11000);

    // 1200 kg at ₹65/kg = ₹78,000
    expect(calculateTotalValue(1200, 65)).toBe(78000);
  });

  it('formats currency with INR symbol', () => {
    const formatted = formatCurrency(78000);
    expect(formatted).toContain('78,000');
  });

  it('rejects negative numbers gracefully', () => {
    expect(() => normalizeToKg(-10, 'kg')).toThrow();
    expect(() => normalizePricePerKg(-100, 'quintal')).toThrow();
    expect(() => calculateTotalValue(-500, 20)).toThrow();
  });
});
