import { describe, it, expect } from 'vitest';
import {
  validateListingTransition,
  validateOfferTransition,
} from '../../src/lib/utils/state-machine';

describe('Listing Lifecycle State Machine', () => {
  it('allows valid progressive transitions', () => {
    expect(validateListingTransition('draft', 'posted').isValid).toBe(true);
    expect(validateListingTransition('posted', 'buyer_interested').isValid).toBe(true);
    expect(validateListingTransition('buyer_interested', 'visit_confirmed').isValid).toBe(true);
    expect(validateListingTransition('visit_confirmed', 'partially_sold').isValid).toBe(true);
    expect(validateListingTransition('visit_confirmed', 'sold').isValid).toBe(true);
  });

  it('allows cancellation from non-terminal states', () => {
    expect(validateListingTransition('draft', 'cancelled').isValid).toBe(true);
    expect(validateListingTransition('posted', 'cancelled').isValid).toBe(true);
    expect(validateListingTransition('buyer_interested', 'cancelled').isValid).toBe(true);
    expect(validateListingTransition('visit_confirmed', 'cancelled').isValid).toBe(true);
  });

  it('rejects illegal transitions with clear error messages', () => {
    const invalidResult = validateListingTransition('posted', 'sold');
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.error).toContain('Cannot change listing status from "posted" to "sold"');

    const terminalResult = validateListingTransition('sold', 'posted');
    expect(terminalResult.isValid).toBe(false);

    const cancelledResult = validateListingTransition('cancelled', 'posted');
    expect(cancelledResult.isValid).toBe(false);
  });
});

describe('Offer Lifecycle State Machine', () => {
  it('allows standard offer workflows', () => {
    expect(validateOfferTransition('pending', 'accepted').isValid).toBe(true);
    expect(validateOfferTransition('pending', 'declined').isValid).toBe(true);
    expect(validateOfferTransition('pending', 'withdrawn').isValid).toBe(true);
  });

  it('rejects changes once declined or withdrawn', () => {
    expect(validateOfferTransition('declined', 'accepted').isValid).toBe(false);
    expect(validateOfferTransition('withdrawn', 'accepted').isValid).toBe(false);
  });
});
