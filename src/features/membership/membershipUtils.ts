// Helpers for reading membership status out of the JWT.
// The backend includes `membership` (from the profiles table) in the
// token payload at login. Older tokens predate the claim, so this
// returns null when the field is absent and callers should fall back
// to GET /membership/status.

export function getMembershipFromToken(token: string): boolean | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    if (typeof payload.membership === 'boolean') return payload.membership
    return null
  } catch {
    return null
  }
}

// The backend puts the user type in the JWT `role` claim
// ("ADMIN" for admins, "USER" otherwise).
export function getRoleFromToken(token: string): string | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    if (typeof payload.role === 'string') return payload.role
    return null
  } catch {
    return null
  }
}

export function isAdminToken(token: string): boolean {
  return getRoleFromToken(token) === 'ADMIN'
}

export const WHITE_PAPER_URL =
  import.meta.env.VITE_WHITEPAPER_URL ??
  'http://107.191.61.192:8000/download/vwhite_paper.pdf'

export const ANSWERS_CACHE_KEY = 'membership_answers'

// Dummy data until commitment-level / badges APIs exist.
export const DUMMY_BADGES = ['member', 'builder'] as const
export const ALL_BADGES = [
  'member',
  'contributor',
  'builder',
  'inventor',
  'scholar',
  'luminary',
  'founder',
  'warrior',
] as const
export const DUMMY_COMMITMENT_LEVEL = 7

export interface DialCode {
  iso: string
  name: string
  dial: string
}

export const DIAL_CODES: DialCode[] = [
  { iso: 'NG', name: 'Nigeria', dial: '234' },
  { iso: 'GH', name: 'Ghana', dial: '233' },
  { iso: 'KE', name: 'Kenya', dial: '254' },
  { iso: 'ZA', name: 'South Africa', dial: '27' },
  { iso: 'UG', name: 'Uganda', dial: '256' },
  { iso: 'TZ', name: 'Tanzania', dial: '255' },
  { iso: 'RW', name: 'Rwanda', dial: '250' },
  { iso: 'CM', name: 'Cameroon', dial: '237' },
  { iso: 'SN', name: 'Senegal', dial: '221' },
  { iso: 'CI', name: 'Ivory Coast', dial: '225' },
  { iso: 'ET', name: 'Ethiopia', dial: '251' },
  { iso: 'EG', name: 'Egypt', dial: '20' },
  { iso: 'GB', name: 'United Kingdom', dial: '44' },
  { iso: 'US', name: 'United States', dial: '1' },
  { iso: 'CA', name: 'Canada', dial: '1' },
  { iso: 'FR', name: 'France', dial: '33' },
  { iso: 'DE', name: 'Germany', dial: '49' },
  { iso: 'NL', name: 'Netherlands', dial: '31' },
  { iso: 'IN', name: 'India', dial: '91' },
  { iso: 'PK', name: 'Pakistan', dial: '92' },
  { iso: 'BD', name: 'Bangladesh', dial: '880' },
  { iso: 'PH', name: 'Philippines', dial: '63' },
  { iso: 'ID', name: 'Indonesia', dial: '62' },
  { iso: 'MY', name: 'Malaysia', dial: '60' },
  { iso: 'SG', name: 'Singapore', dial: '65' },
  { iso: 'AE', name: 'UAE', dial: '971' },
  { iso: 'SA', name: 'Saudi Arabia', dial: '966' },
  { iso: 'BR', name: 'Brazil', dial: '55' },
  { iso: 'AU', name: 'Australia', dial: '61' },
]

// Best-effort timezone -> country guess (no network needed).
const TIMEZONE_COUNTRY: Record<string, string> = {
  'Africa/Lagos': 'NG',
  'Africa/Accra': 'GH',
  'Africa/Nairobi': 'KE',
  'Africa/Johannesburg': 'ZA',
  'Africa/Kampala': 'UG',
  'Africa/Dar_es_Salaam': 'TZ',
  'Africa/Kigali': 'RW',
  'Africa/Douala': 'CM',
  'Africa/Dakar': 'SN',
  'Africa/Abidjan': 'CI',
  'Africa/Addis_Ababa': 'ET',
  'Africa/Cairo': 'EG',
  'Europe/London': 'GB',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Los_Angeles': 'US',
  'America/Toronto': 'CA',
  'Europe/Paris': 'FR',
  'Europe/Berlin': 'DE',
  'Europe/Amsterdam': 'NL',
  'Asia/Kolkata': 'IN',
  'Asia/Karachi': 'PK',
  'Asia/Dhaka': 'BD',
  'Asia/Manila': 'PH',
  'Asia/Jakarta': 'ID',
  'Asia/Kuala_Lumpur': 'MY',
  'Asia/Singapore': 'SG',
  'Asia/Dubai': 'AE',
  'Asia/Riyadh': 'SA',
  'America/Sao_Paulo': 'BR',
  'Australia/Sydney': 'AU',
}

export function detectCountryIso(): string {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (zone && TIMEZONE_COUNTRY[zone]) return TIMEZONE_COUNTRY[zone]
  } catch {
    // ignore, fall through to default
  }
  return 'NG'
}

export function dialCodeForIso(iso: string): string {
  return DIAL_CODES.find((d) => d.iso === iso)?.dial ?? '234'
}
