/**
 * Shared contract between the contact form and its API route, so the client's
 * `maxLength` attributes and the server's validation can't drift apart.
 */

export const CONTACT_LIMITS = {
  name: 100,
  /** RFC 5321 caps a full address at 254 characters. */
  email: 254,
  subject: 150,
  message: 4000,
} as const;

/**
 * Deliberately loose. A regex can't tell you an address is deliverable, so this
 * only catches the obvious typo (missing @, missing dot) before the visitor
 * spends effort on a message that would come back unreplyable.
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Hidden field name. Real visitors never see it, so anything filled in here
 * came from a bot walking the DOM.
 *
 * Deliberately not a word autofill recognises. This was previously "company"
 * with a matching <label>, which Chrome filled from the user's saved
 * organisation — it ignores autocomplete="off" for address-type fields — so
 * genuine submissions were silently classified as bots and dropped.
 */
export const HONEYPOT_FIELD = "contact_ref";
