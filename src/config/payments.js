/**
 * Online payment settings for the skating trial class (30 AED).
 *
 * 1. Paste your payment link between the quotes below
 *    (for example a Stripe, Ziina, Tap or PayTabs payment link for 30 AED).
 *
 * 2. In your payment provider's settings for that link, set the
 *    "after payment / success / redirect" address to:
 *        https://strategyaccademy.netlify.app/thank-you
 *    (use your own domain instead if the website moves).
 */
export const TRIAL_PAYMENT_LINK = '';

/**
 * Your team's WhatsApp number: country code + number, digits only, no + or spaces.
 * Example for 050 123 4567 in the UAE: '971501234567'
 * (The thank-you page's "Chat with our team" button opens WhatsApp to this number.)
 */
export const TEAM_WHATSAPP_NUMBER = '971501234567';

/** Builds the address the visitor is sent to, adding booking details where the provider supports it. */
export function buildTrialPaymentUrl(link, { bookingId, email } = {}) {
  try {
    const url = new URL(link);
    // Stripe payment links can carry a booking reference and pre-fill the email
    if (/(^|\.)stripe\.com$/.test(url.hostname)) {
      if (bookingId) url.searchParams.set('client_reference_id', bookingId);
      if (email) url.searchParams.set('prefilled_email', email);
    }
    return url.toString();
  } catch {
    return link;
  }
}
