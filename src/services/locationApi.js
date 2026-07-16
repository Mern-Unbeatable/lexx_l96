/**
 * Location API stubs — replace these with real backend calls later.
 *
 * Expected backends:
 * - GET /api/locations/suggest?q=...
 * - POST /api/locations/reverse { lat, lng }
 */

const MOCK_LOCATIONS = [
  'London, SW1A 1AA',
  'London, Greater London',
  'Surrey, England',
  'Sunningdale, Berkshire',
  'Ascot, Berkshire',
  'Wentworth, Surrey',
  'Walton-on-Thames, Surrey',
  'Guildford, Surrey',
  'Woking, Surrey',
  'Reading, Berkshire',
  'Windsor, Berkshire',
  'Tadworth, Surrey',
  'Manchester, M1 1AE',
  'Birmingham, B1 1BB',
  'Bristol, BS1 4DJ',
]

const delay = (ms = 350) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const fetchLocationSuggestions = async (query) => {
  // TODO: replace with backend
  await delay()
  const q = query.trim().toLowerCase()
  if (!q) return []
  return MOCK_LOCATIONS.filter((item) => item.toLowerCase().includes(q)).slice(0, 6)
}

const formatTownPostcode = (data) => {
  const addr = data?.address || {}
  const town =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.suburb ||
    addr.municipality ||
    addr.county ||
    ''
  const postcode = addr.postcode || ''

  if (town && postcode) return `${town}, ${postcode}`
  if (postcode) return postcode
  if (town) return town
  if (data?.display_name) {
    return data.display_name.split(',').slice(0, 2).join(',').trim()
  }
  return ''
}

export const reverseGeocode = async (lat, lng) => {
  // Prefer Nominatim for town/postcode until backend is ready
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    })
    if (!response.ok) throw new Error('Reverse geocode failed')
    const data = await response.json()
    const label = formatTownPostcode(data)
    if (label) return label
  } catch {
    // fall through to stub
  }

  await delay(300)
  // Deterministic stub near London for demo when network blocked
  return 'London, SW1A 1AA'
}

export const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error('User denied the request for Geolocation'))
          return
        }
        if (error.code === error.POSITION_UNAVAILABLE) {
          reject(new Error('Location information is unavailable'))
          return
        }
        if (error.code === error.TIMEOUT) {
          reject(new Error('The request to get user location timed out'))
          return
        }
        reject(new Error('Unable to retrieve your location'))
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  })
