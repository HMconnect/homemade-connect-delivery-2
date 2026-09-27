// US phone helpers. Numbers are stored as +1XXXXXXXXXX (works for text messages).

export const phoneDigits = (value: string) => value.replace(/\D/g, '');

/** Returns +1XXXXXXXXXX for a valid US number, or null if it isn't one. */
export const normalizeUSPhone = (value: string): string | null => {
  let d = phoneDigits(value);
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1);
  if (d.length !== 10) return null;
  return `+1${d}`;
};

/** Formats as the user types: (312) 555-0123 */
export const formatUSPhoneInput = (value: string): string => {
  let d = phoneDigits(value);
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length <= 3) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

/** Display a stored number (+13125550123) as (312) 555-0123 */
export const displayPhone = (stored?: string | null): string =>
  stored ? formatUSPhoneInput(stored) : '';
