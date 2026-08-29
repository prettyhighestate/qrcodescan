export function detectQRType(data) {//detect the type of QR code content
  if (!data) return 'text';

  const trimmed = data.trim();

  // URLs
  if (/^https?:\/\//i.test(trimmed)) return 'url';
  if (/^www\./i.test(trimmed)) return 'url';

  // Email
  if (/^mailto:/i.test(trimmed)) return 'email';
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'email';

  // Phone numbers
  if (/^tel:/i.test(trimmed)) return 'phone';
  if (/^contact:/i.test(trimmed)) return 'phone';
  if (/^\+?[0-9\s\-()]{7,}$/.test(trimmed)) return 'phone';

  // SMS
  if (/^sms:/i.test(trimmed)) return 'sms';

  // Wi-Fi
  if (/^WIFI:/i.test(trimmed)) return 'wifi';

  // Geo coordinates (standard geo: and custom location:)
  if (/^geo:/i.test(trimmed)) return 'geo';
  if (/^location:/i.test(trimmed)) return 'geo';

  // Contact (vCard or MeCard) - keep for scans
  if (/^BEGIN:VCARD/i.test(trimmed) || /^MECARD:/i.test(trimmed)) return 'contact';

  // Plain text
  return 'text';
}