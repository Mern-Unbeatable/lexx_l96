const parseCostPerRound = (value) => {
  if (value === '' || value == null) return null
  const match = String(value).replace(/,/g, '').match(/-?\d+(\.\d+)?/)
  if (!match) return null
  return Number(match[0])
}

export const buildCreateGamePayload = (formData, selectedLocation) => {
  const latitude = Number(
    selectedLocation?.latitude ?? selectedLocation?.lat,
  )
  const longitude = Number(
    selectedLocation?.longitude ?? selectedLocation?.lon,
  )

  if (
    !selectedLocation ||
    Number.isNaN(latitude) ||
    Number.isNaN(longitude)
  ) {
    throw new Error('Please select a course location before posting.')
  }

  const costPerRound = parseCostPerRound(formData.cost)

  return {
    courseName: formData.course,
    locationName: formData.location,
    latitude,
    longitude,
    date: formData.date,
    time: formData.time,
    spotsAvailable: Number(formData.spots),
    ageMin: formData.ageMin,
    ageMax: formData.ageMax,
    handicapMin: formData.handicapMin,
    handicapMax: formData.handicapMax,
    costPerRound,
    notes: formData.notes?.trim() || '',
  }
}
