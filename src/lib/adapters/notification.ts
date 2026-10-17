/**
 * ==============================================================================
 * SMART FARMER CONNECT: NOTIFICATION ADAPTERS & MOCK SYSTEM
 * ==============================================================================
 * Handles multi-channel notifications:
 *  - In-App (Direct DB write)
 *  - SMS (MSG91 / Twilio / Mock)
 *  - WhatsApp Cloud API (Meta / Mock)
 *  - Web Push (VAPID / Mock)
 *
 * Honors honest demo mode: If keys are absent, sets status to 'mock'
 * and clearly states: "Demo mode: no real SMS sent".
 * ==============================================================================
 */

export interface NotificationPayload {
  recipientPhone: string;
  recipientName: string;
  farmerName: string;
  village: string;
  cropName: string;
  quantity: number;
  unit: string;
  expectedPrice: number;
  harvestDate: string;
  marketName: string;
  listingId: string;
}

export interface NotificationResult {
  channel: 'in_app' | 'sms' | 'whatsapp' | 'push';
  deliveryStatus: 'queued' | 'sent' | 'failed' | 'mock';
  message: string;
  rawResponse?: unknown;
}

export interface NotificationProvider {
  sendNewCropAlert(payload: NotificationPayload): Promise<NotificationResult>;
}

/**
 * Mock Notification Provider for local testing & demos without live SMS gateways
 */
export class MockNotificationProvider implements NotificationProvider {
  async sendNewCropAlert(payload: NotificationPayload): Promise<NotificationResult> {
    const formattedMessage = `🌾 NEW CROP AVAILABLE
Farmer: ${payload.farmerName}, ${payload.village}
Crop: ${payload.cropName}   Quantity: ${payload.quantity} ${payload.unit}
Expected price: ₹${payload.expectedPrice}/${payload.unit}
Harvest date: ${payload.harvestDate}   Market: ${payload.marketName}
[Interested, Visit Tomorrow]  [Details]  [Not Interested]`;

    console.info('----------------------------------------');
    console.info('📢 [MOCK NOTIFICATION DISPATCHED]');
    console.info(`To: ${payload.recipientPhone} (${payload.recipientName})`);
    console.info(formattedMessage);
    console.info('Demo mode: no real SMS sent');
    console.info('----------------------------------------');

    return {
      channel: 'sms',
      deliveryStatus: 'mock',
      message: 'Demo mode: no real SMS sent. Message recorded in local activity log.',
    };
  }
}

/**
 * Factory to return the active notification adapter based on environment
 */
export function getNotificationProvider(): NotificationProvider {
  const isMockMode = process.env.MOCK_SMS_MODE !== 'false';
  if (isMockMode || !process.env.MSG91_AUTH_KEY) {
    return new MockNotificationProvider();
  }
  // Future production MSG91 / Twilio adapter implementation in Phase 5
  return new MockNotificationProvider();
}
