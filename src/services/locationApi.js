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
  'Manchester, M1 1AE',
  'Birmingham, B1 1BB',
  'Edinburgh, EH1 1YZ',
  'Bristol, BS1 4DJ',
]

const delay = (ms = 350) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const fetchLocationSuggestions = async (query) => {
  // TODO: replace with backend — e.g. fetch(`/api/locations/suggest?q=${encodeURIComponent(query)}`)
  await delay()
  const q = query.trim().toLowerCase()
  if (!q) return []
  return MOCK_LOCATIONS.filter((item) => item.toLowerCase().includes(q)).slice(0, 6)
}

export const reverseGeocode = async (lat, lng) => {
  // TODO: replace with backend — e.g. fetch('/api/locations/reverse', { method: 'POST', body: JSON.stringify({ lat, lng }) })
  await delay(500)
  return `Near ${lat.toFixed(3)}, ${lng.toFixed(3)}`
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
