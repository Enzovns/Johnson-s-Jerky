// Zone de livraison : Kalgoorlie + Boulder + alentours
const VALID_POSTCODES = new Set([
  '6430', // Kalgoorlie
  '6431', // Boulder
  '6432', // Kambalda
  '6433', // Norseman
  '6434', // Widgiemooltha
  '6435', // Coolgardie
  '6436', // Leonora
  '6437', // Laverton
  '6438', // Leinster
])

export function isValidDeliveryPostcode(postcode: string): boolean {
  return VALID_POSTCODES.has(postcode.trim())
}

export const POSTCODE_ERROR_MESSAGE =
  "Sorry, pardner — we only ride to Kalgoorlie, Boulder and surrounds (postcodes 6430–6438). For other areas, drop us an email!"

export function getSuburbsForPostcode(postcode: string): string {
  const map: Record<string, string> = {
    '6430': 'Kalgoorlie',
    '6431': 'Boulder',
    '6432': 'Kambalda',
    '6433': 'Norseman',
    '6434': 'Widgiemooltha',
    '6435': 'Coolgardie',
    '6436': 'Leonora',
    '6437': 'Laverton',
    '6438': 'Leinster',
  }
  return map[postcode] || ''
}
