/**
 * ==============================================================================
 * SMART FARMER CONNECT: LISTING & OFFER STATE MACHINE
 * ==============================================================================
 * Enforces the exact lifecycle:
 *  draft -> posted -> buyer_interested -> visit_confirmed -> partially_sold -> sold
 *  plus cancelled and expired.
 * Rejects illegal transitions with friendly messages.
 * ==============================================================================
 */

export type ListingStatus =
  | 'draft'
  | 'posted'
  | 'buyer_interested'
  | 'visit_confirmed'
  | 'partially_sold'
  | 'sold'
  | 'cancelled'
  | 'expired';

export type OfferStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'expired';

const VALID_LISTING_TRANSITIONS: Record<ListingStatus, ListingStatus[]> = {
  draft: ['posted', 'cancelled'],
  posted: ['buyer_interested', 'cancelled', 'expired'],
  buyer_interested: ['visit_confirmed', 'partially_sold', 'sold', 'cancelled', 'expired'],
  visit_confirmed: ['partially_sold', 'sold', 'cancelled'],
  partially_sold: ['visit_confirmed', 'sold', 'cancelled'],
  sold: [], // Terminal state
  cancelled: [], // Terminal state
  expired: [], // Terminal state
};

export interface TransitionResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates whether a crop listing can move from its current status to a target status
 */
export function validateListingTransition(
  currentStatus: ListingStatus,
  targetStatus: ListingStatus
): TransitionResult {
  if (currentStatus === targetStatus) {
    return { isValid: true };
  }

  const allowed = VALID_LISTING_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.includes(targetStatus)) {
    return {
      isValid: false,
      error: `Cannot change listing status from "${currentStatus}" to "${targetStatus}". This transition is not permitted.`,
    };
  }

  return { isValid: true };
}

/**
 * Validates offer status transitions
 */
export function validateOfferTransition(
  currentStatus: OfferStatus,
  targetStatus: OfferStatus
): TransitionResult {
  if (currentStatus === targetStatus) {
    return { isValid: true };
  }

  const allowedMap: Record<OfferStatus, OfferStatus[]> = {
    pending: ['accepted', 'declined', 'withdrawn', 'expired'],
    accepted: ['withdrawn', 'declined'],
    declined: [],
    withdrawn: [],
    expired: [],
  };

  const allowed = allowedMap[currentStatus];
  if (!allowed || !allowed.includes(targetStatus)) {
    return {
      isValid: false,
      error: `Cannot update offer from "${currentStatus}" to "${targetStatus}".`,
    };
  }

  return { isValid: true };
}
